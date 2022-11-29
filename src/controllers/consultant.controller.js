/* eslint-disable camelcase */
import { pool } from '@database';
import dayjs from 'dayjs';
import { logger }  from '@logger';
import { numericFormat } from '../libs/formatnumbers';


export const getConsultant = async(req, res) => {
	try {
		const [rows] = await pool.query(`
		SELECT cao_usuario.co_usuario, cao_usuario.no_usuario
		FROM cao_usuario
		INNER JOIN permissao_sistema ON cao_usuario.co_usuario = permissao_sistema.co_usuario
		WHERE permissao_sistema.co_tipo_usuario = 0 || 1 || 2
				&& permissao_sistema.co_sistema = 1 
				&& permissao_sistema.in_ativo = 'S'`);


		res.status(200).json({
			message:'succesfull request',
			result: rows
		});
	} catch (error) {
		res.status(500).json({message: 'an error has occurred please try the query again later'});
		logger.error(error);
	}
	
};

export const generateInform = async(req, res) => {

	try {
		const { from, to, consultant } = req.body;

		const newConsult = consultant.map(result =>{return `'${result}'`;});

		const [rows] = await pool.query(`
			SELECT valor,total,total_imp_inc,comissao_cn, cao_os.co_usuario, data_emissao, cao_salario.brut_salario, cao_usuario.no_usuario
			FROM cao_fatura 
			INNER JOIN cao_os ON cao_fatura.co_os = cao_os.co_os
			INNER JOIN cao_salario ON cao_os.co_usuario = cao_salario.co_usuario
			INNER JOIN cao_usuario ON cao_os.co_usuario = cao_usuario.co_usuario
			WHERE cao_os.co_usuario IN (${newConsult.toString()}) && data_emissao BETWEEN '${dayjs(from).format('YYYY-MM-DD')}' AND '${dayjs(to).format('YYYY-MM-DD')}'
			ORDER BY no_usuario,data_emissao ASC;
		`);
		

		const result = rows.map((result) =>{
			
			const { valor, total_imp_inc, comissao_cn, brut_salario, data_emissao,no_usuario, co_usuario } = result;
			let totalImp = (valor * getPercent(total_imp_inc));
			let receitaLiquida = valor - totalImp;
			
			let comissao = (valor  - (valor * getPercent(total_imp_inc))) * getPercent(comissao_cn);

			let lucro = (valor - getPercent(total_imp_inc)) - (brut_salario + comissao);


			return {
				'receita_liquida': numericFormat(receitaLiquida,'.',',',2),
				'custo_fixo': numericFormat(brut_salario,'.',',',2),
				comissao: numericFormat(comissao,'.',',',2),
				lucro: numericFormat(lucro,'.',',',2),
				data_emissao: dayjs(data_emissao).format('MMMM YYYY'),
				no_usuario: no_usuario,
				co_usuario: co_usuario
			};
		});

		res.status(200).json({
			message: 'succesfull request',
			result
		});
	} catch (error) {
		res.status(500).json({message: 'an error has occurred please try the query again later'});
		logger.error(error);
	}

};

const getPercent = (value) => { return value * (1/100); };

