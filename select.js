var fs = require('fs');
const Client = require('pg').Client
var json2xls = require('json2xls');
var XLSX = require('xlsx');
var opt={
  user: 'postgres',
  host: '200.17.60.228',
  database: 'incra',
  password: '@n4OXcpK4Q8',
  port: 5432,
}
const conn = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'incra',
  //password: '@n4OXcpK4Q8',
  port: 5432,
})
var options=[
  {'view':'pesquisa.radis_completo', "name":'radis_completo', 'where':''},
  {'view':'radis_view.v_exploracao', "name":"Ocupacao e exploracao é feita", 'where':''},
  {'view':'radis_view.v_nucleofamiliar', "name": "Nucleo Familiar", 'where':''},
  {'view':'radis_view.v_psg_quais', "name":"Politica Moradia", 'where':''},
  {'view':'radis_view.v_credito', "name":"credito", 'where':''},
  {'view':'radis_view.v_comunicacao_tipo', "name":"Tipo comunicacao", 'where':''},
  {'view':'radis_view.v_agua_moradia', "name":'agua', 'where':''},
  {'view':'radis_view.v_saude_tipo', "name":"Saude tipo", 'where':''},
  {'view':'radis_view.v_saude_tratamento', "name":"Saude tratamento", 'where':''},
  {'view':'radis_view.v_saude_acesso ', "name":"Saude acesso", 'where':''},
  {'view':'radis_view.v_sociocultural', "name":"SocioCultural", 'where':''},
  {'view':'radis_view.v_socioprodutiva', "name":"SocioProdutiva", 'where':''},
  {'view':'radis_view.v_quintal_vegetal', "name":"Quintais produtivos - Vegetal", 'where':''},
  {'view':'radis_view.v_quintal_animal', "name":"Quintais produtivos - Animal", 'where':''},
  {'view':"( SELECT v_pp.cod_coleta,radis_view.v_pp.cod_pa,v_pp.sistema_producao, v_pp.area, v_pp.tipo, v_pp.manejo,v_pp.quantidade_cultura, "+
  "v_pp_c.cultura, v_pp_c.cultura_outros,"+
  " v_pp_c.sementes_mudas , v_pp_c.propria_comprada_doada ,v_pp_c.crioula ,"+
  " v_pp_c.formacao ,"+
  " v_pp_c.prod_anual ,"+
  " v_pp_c.prod_auto ,"+
  " v_pp_c.prod_comercial,"+
  " v_pp_c.prod_comercial_vlr ,"+
  " v_pp_c_canais.valor"+
  " FROM radis_view.v_pp,"+
  "radis_view.v_pp_c,"+
  "radis_view.v_pp_c_canais "+
  " WHERE v_pp.cod = v_pp_c.cod_plantio AND v_pp_c_canais.cod_cultura = v_pp_c.cod )", "name":'Cultura', 'where':''},
  {'view':'radis_view.v_floresta', "name":"Area reflorestada", 'where':''},
  {'view':'radis_view.v_pa_bl_reproducao', "name":"Reproducao bovino leite", 'where':''},
  {'view':'radis_view.v_pa_bl_com_alimentar', "name":"Comp bovino leite", 'where':''},
  {'view':'radis_view.v_pa_bl_canais', "name":"Canais bovino leite", 'where':''},
  {'view':'radis_view.v_pa_bv_comp_alimentar', "name":"Comp alimentar bovino corte", 'where':''},
  {'view':'radis_view.v_pa_bv_sist_criacao', "name": "sistema criacao bovino corte", 'where':''},
  {'view':'radis_view.v_pa_bv_reproducao', "name":"Reproducao bovino corte", 'where':''},
  {'view':'radis_view.v_pa_bv_canais', "name":"Canais bovino corte", 'where':''},
  {'view':'radis_view.v_pa_sui_comp_alimentar', "name":"Comp alimentar suino", 'where':''},
  {'view':'radis_view.v_pa_sui_sist_criacao', "name":"Suino sistema de criacao", 'where':''},
  {'view':'radis_view.v_pa_sui_canais', "name":"Canais suino", 'where':''},
  {'view':'radis_view.v_pa_avic_comp_alimentar', "name": "Comp alimentar aves cortes", 'where':''},
  {'view':'radis_view.v_pa_avic_canais', "name":"Canais aves cortes", 'where':''},
  {'view':'radis_view.v_pa_avip_comp_alimentar', "name":"Comp alimentar aves postura", 'where':''},
  {'view':'radis_view.v_pa_avip_canais', "name":"Canais aves postura", 'where':''},
  {'view':" ( SELECT radis_view.v_piscicultura.cod_coleta, "+
  " 	v_piscicultura.especie, "+
  " v_piscicultura.especie_outros , "+
  " v_piscicultura.tipo , "+
  " v_piscicultura.manejo, "+
  " v_piscicultura.sist_pesca , "+
  " v_pa_pis_comp_alimentar.valor , "+
  " v_pa_pis_canais.valor  "+
  "  FROM radis_view.v_piscicultura, "+
  "   radis_view.v_pa_pis_comp_alimentar, "+
  "   radis_view.v_pa_pis_finalidade, "+
  "   radis_view.v_pa_pis_canais  "+
  " WHERE v_piscicultura.cod = v_pa_pis_comp_alimentar.cod_piscicultura AND v_pa_pis_finalidade.cod_piscicultura = v_piscicultura.cod AND v_pa_pis_canais.cod_piscicultura = v_piscicultura.cod ) ", "name":"Psicultura", 'where':''},
  {'view':'radis_view.v_pa_ovi_comp_alimentar', "name":"Comp alimentar ovino", 'where':''},
  {'view':'radis_view.v_pa_ovi_canais', "name":"Canais ovino", 'where':''},
  {'view':'radis_view.v_pa_cap_comp_alimentar', "name": "Comp alimentar caprino", 'where':''},
  {'view':'radis_view.v_pa_cap_canais', "name":"Canais caprino", 'where':''},
  {'view':'radis_view.v_pa_api_canais', "name":"Canais apicultura", 'where':''},
  {'view':" ( SELECT v_aquicultura.cod_coleta,v_aquicultura.cultura, "+
  "   v_aquicultura.producao ,"+
  "   v_aquicultura.autoconsumo ,"+
  "   v_aquicultura.producao_comercial ,"+
  "   v_aquicultura.valor_anual ,"+
  "   v_pa_aqui_canais.valor "+
  "  FROM radis_view.v_aquicultura, "+
  "   radis_view.v_pa_aqui_canais "+
  " WHERE v_aquicultura.cod = v_pa_aqui_canais.cod_aquicultura) ", "name":"Aquicultura", 'where':''},
  {'view':'radis_view.v_pa_bub_canais', "name":"Canais bulbalino carne", 'where':''},
  {'view':'radis_view.v_pa_bub_l_canais', "name":"Canais bulbalino leite", 'where':''},
  {'view':"radis_view.v_extrativismo ", "name":"Extrativismo", 'where':''},
  {'view':" ( SELECT v_proc_alimentos.cod_coleta,v_proc_alimentos.categoria, "+
                  "   v_proc_alimentos.categoria_outros, "+
                  "   v_proc_alimentos.agroindustria, "+
                  "   v_proc_alimentos.produto, "+
                  "   v_proc_alimentos_reg_sanitario.valor as registro_sanitaorio, "+
                  "   v_proc_alimentos_mat_prima.valor as materia_prima, "+
                  "   v_proc_alimentos_canais.valor as canais_comercializacao "+
                  "  FROM radis_view.v_proc_alimentos, "+
                "     radis_view.v_proc_alimentos_mat_prima, "+
                  "   radis_view.v_proc_alimentos_reg_sanitario, "+
                  "   radis_view.v_proc_alimentos_canais "+
                "   WHERE v_proc_alimentos_mat_prima.cod_proc_alimentos = v_proc_alimentos.cod AND v_proc_alimentos_reg_sanitario.cod_proc_alimentos = v_proc_alimentos.cod AND v_proc_alimentos_canais.cod_proc_alimentos = v_proc_alimentos.cod) ", "name": "Processamento alimentos", 'where':''},
  {'view':'radis_view.v_praticas', "name":'Praticas', 'where':''},
  {'view':'radis_view.v_as_avistado', "name": "Animais silvestres Avistados", 'where':''},
  {'view':'radis_view.v_as_problema_qual', "name":"Animais silvestres Problema",'where':''},
  {'view':'radis_view.v_benfeitoria', "name":"Benfeitorias", 'where':''},
  {'view':'radis_view.v_princ_maq_equip', "name":"Maquinario_Equipamentos", 'where':''},
  {'view':'radis_view.v_car_possui_deficit_rl_regularizar', "name":"Defict RL regularizar", 'where':''},
  {'view':'radis_view.v_car_possui_deficit_rl_compensar', "name":"Defict RL Compensar", 'where':''},
  {'view':'radis_view.v_car_existe_tac', "name":"TAC", 'where':''},
  {'view':'radis_view.v_car_existe_prad', "name":"PRAD", 'where':''},
  {'view':'radis_view.v_car_possui_excedente_vegetacao_nativa_fazer', "name":"Excedente vegetacao", 'where':''},
  {'view':'radis_view.v_car_rl_temporalidade', "name":"RL legislacao", 'where':''},
  {'view':'radis_view.v_restricoes', "name":"Restricoes", 'where':''},
  {'view':'radis_view.v_pl', "name":"Parceria lote", 'where':''},
  {'view':'radis_view.v_quem_participou', "name":"quem_participou", 'where':''},
]

async function f() {
  await conn.connect();

  var wb = XLSX.utils.book_new();

  async function book_append_table(wb, name,sheet, where) {
    var string=  "SELECT tmp.* FROM  radis_view.v_geral,geo_din.loteamento,radis.radis, " +name+ " as tmp "+
    "where tmp.cod_coleta=radis_view.v_geral.cod_coleta and radis_view.v_geral.cod_coleta=geo_din.loteamento.cod_coleta and radis.radis.cod=geo_din.loteamento.cod_coleta "+
    " and (radis_view.v_geral.cod_pa='MT0262000' or radis_view.v_geral.cod_pa='MT0223000' or radis_view.v_geral.cod_pa='MT0689000' or radis_view.v_geral.cod_pa='MG0289000' or radis_view.v_geral.cod_pa='MG0116000' or radis_view.v_geral.cod_pa='MG0085000') "+where+' ' ;
    console.log(string)
    var r_f = await conn.query(string );
    //console.log(r_f)
    var r=[];
    if(r_f.rows.length>0){
      r=r_f.rows;
    }else{
      var tmp={}
      r_f.fields.forEach((elem)=>{
        tmp[elem.name]='';
      })
      r.push(tmp)
    }
    var ws = XLSX.utils.json_to_sheet(r);
    XLSX.utils.book_append_sheet(wb, ws, sheet);
  }
  async function processArray(wb,array) {
    for(let i in array){
      console.log(array[i].name)
      await book_append_table(wb, array[i].view,array[i].name,array[i].where);
    }
  }
  //await book_append_table(wb, options[0].view,options[0].name);
  await processArray(wb,options)
  XLSX.writeFile(wb, "radis.xlsx");
  console.log("finish")
}
f();
