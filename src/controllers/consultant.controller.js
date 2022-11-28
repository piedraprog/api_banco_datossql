/* eslint-disable camelcase */
import { pool } from '@database';
// import dayjs from 'dayjs';
// import { numericFormat } from '@libs/formatnumbers';

export const getConsultant = async(req, res) => {

	const [rows] = await pool.query(`
		SELECT cao_usuario.co_usuario, cao_usuario.no_usuario
		FROM cao_usuario
		INNER JOIN permissao_sistema ON cao_usuario.co_usuario = permissao_sistema.co_usuario
		WHERE permissao_sistema.co_tipo_usuario = 0 || 1 || 2
				&& permissao_sistema.co_sistema = 1 
				&& permissao_sistema.in_ativo = 'S'`);


	res.json(rows);
};

export const generateInform = async(req, res) => {


	const [rows] = await pool.query(`
		SELECT valor,total,total_imp_inc,comissao_cn, cao_os.co_usuario, data_emissao, cao_salario.brut_salario, cao_usuario.no_usuario
		FROM cao_fatura 
		INNER JOIN cao_os ON cao_fatura.co_os = cao_os.co_os
		INNER JOIN cao_salario ON cao_os.co_usuario = cao_salario.co_usuario
		INNER JOIN cao_usuario ON cao_os.co_usuario = cao_usuario.co_usuario
		WHERE cao_os.co_usuario IN ('carlos.arruda', 'fernanda.barbosa') && data_emissao BETWEEN '2007-09-00' AND '2007-9-31'
		ORDER BY no_usuario,data_emissao ASC;
	`);

	const result = rows.map((result) =>{
		
		const { valor, total_imp_inc, comissao_cn, brut_salario, data_emissao,no_usuario, co_usuario } = result;
		let totalImp = (valor * getPercent(total_imp_inc));
		let receitaLiquida = valor - totalImp;
		
		let comissao = (valor  - (valor * getPercent(total_imp_inc))) * getPercent(comissao_cn);

		let lucro = (valor - getPercent(total_imp_inc)) - (brut_salario + comissao);


		return {
			'receita_liquida': receitaLiquida,
			'custo_fixo': brut_salario,
			comissao,
			lucro,
			data_emissao,
			no_usuario,
			co_usuario
		};
	});

	// const newRe = result.map( res => {
	// 	return res;
	// }).filter(aqui => aqui.co_usuario == 'carlos.arruda' || 'fernanda.barbosa');


	res.status(200).json(result);

};

const getPercent = (value) => { return value * (1/100); };


// const getStartOfMonth = (date) => {

// 	const day = dayjs(date).get('d') - 1;
// 	return dayjs(date).subtract(day, 'days').format('YYYY-MM-DD');
// };