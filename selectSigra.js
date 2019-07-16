var fs = require('fs');
const Client = require('pg').Client
var json2xls = require('json2xls');
var XLSX = require('xlsx');
const conn = new Client({
  user: 'postgres',
  host: '200.17.60.228',
  database: 'incra',
  password: '@n4OXcpK4Q8',
  port: 5432,
})
var options=[
  {'view':'pesquisa.sigra_completo', "name":'sigra_completo', 'where':''},//766
  {'view':"sigra_view.v_nucleo_familiar", "name":"Nucleo Familiar", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_cm_tipo_contrucao AS construcao, "+
                  "  v_cad_moradia.igp_cm_tipo_contrucao_outros AS Outros, "+
                  "  v_cad_moradia.igp_cm_area AS Area, "+
                  "  v_cad_moradia.igp_cm_numero_comodos AS numero_comodos, "+
                  "  v_cad_moradia.igp_cm_estrutura_comprometida AS estrutura_comprometida, "+
                  "  v_cad_moradia.igp_cm_agrovila AS agrovila "+
                  " FROM sigra_view.v_cad_moradia)", "name":"Tipo Moradia", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_cm_politica AS Politica, "+
                  "  v_cad_moradia.igp_cm_construcao AS Construcao, "+
                  "  v_cad_moradia.igp_cm_reforma AS Reforma, "+
                  "  v_cad_moradia.igp_cm_construcao_qual AS construcao_qual, "+
                  "  v_cad_moradia.igp_cm_construcao_ano AS construcao_ano," +
                  "  v_cad_moradia.igp_cm_reforma_qual AS reforma_qual, "+
                  "  v_cad_moradia.igp_cm_reforma_ano AS reforma_ano "+
                  " FROM sigra_view.v_cad_moradia ) ", "name":"Tipo construacao", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_eletrificacao AS eletrificacao," +
                  "  v_cad_moradia.igp_eletrificacao_fase AS eletrificacao_fase, "+
                  "  v_cad_moradia.igp_eletrificacao_gerador AS gerador, "+
                  "  v_cad_moradia.igp_eletrificacao_problema AS Problema "+
                  " FROM sigra_view.v_cad_moradia) ", "name":"Eletrificacao", 'where':''},
  {'view':'sigra_view.v_comunicacao', "name":"Comunicacao", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_a_moradia as agua_moradia, "+
                  " v_agua_consumo.valor , "+
                  " v_cad_moradia.igp_a_suficiente, "+
                  " v_cad_moradia.igp_a_qualidade "+
                  " FROM sigra_view.v_cad_moradia, "+
                  " sigra_view.v_agua_consumo "+
                  " WHERE v_agua_consumo.cod_moradia = v_cad_moradia.cod) ", "name":"Agua", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_destino_lixo_seco AS lixo_seco "+
                   " FROM sigra_view.v_cad_moradia) ", "name":"Destino lixo seco", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_saneamento AS Saneamento "+
                  " FROM sigra_view.v_cad_moradia) ", "name":"Destino esgoto sanitario", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_dest_agua_servida AS Destino_agua "+
                   " FROM sigra_view.v_cad_moradia) ", "name":"Destino agia pia cozinha", 'where':''},
  {'view':" ( SELECT v_saude_tipo.cod_coleta,v_saude_tipo.nome AS Nome, "+
                  "  v_saude_tipo.valor AS Doenca, "+
                  "  v_saude_acesso.valor AS Acesso,"+
                  "  v_saude_tratamento.valor AS Tratamento "+
                  " FROM sigra_view.v_saude_tipo, "+
                  "  sigra_view.v_saude_acesso, "+
                  "  sigra_view.v_saude_tratamento "+
                  " WHERE v_saude_tipo.cod_saude = v_saude_acesso.cod_saude AND v_saude_tipo.cod_saude = v_saude_tratamento.cod_saude ) ", "name":"Saude", 'where':''},
  {'view':" ( SELECT v_cad_moradia.cod_coleta,v_cad_moradia.igp_psg_recebe AS Recebe, "+
                  " v_cad_moradia.igp_psg_quantos_titulares AS Quantos_titulares "+
                  " FROM sigra_view.v_cad_moradia) ", "name":"Recebe programa social", 'where':''},
  {'view':"  ( SELECT v_prog_social.cod_coleta,v_prog_social.nome AS Nome ,"+
                  " v_prog_social.nis AS NIS, "+
                  " v_prog_social.bolsa_familia AS Bolsa_familia, "+
                  " v_prog_social.bolsa_estudo AS Bolsa_estudo, "+
                  " v_prog_social.cesta_basica AS Cesta_basica," +
                  " v_prog_social.auxilio_temporario AS Auxilio_temporario, "+
                  " v_prog_social.bolsa_estudo_meses AS Bolsa_estudo_meses, "+
                  " v_prog_social.cesta_basica_meses AS Cesta_basica_meses, "+
                  " v_prog_social.auxilio_temporario_meses AS Auxilio_temporario_meses"+
                  " FROM sigra_view.v_prog_social) ", "name":"Programa social", 'where':''},
 {'view':"sigra_view.v_sociocultural", "name":"Sociocultural", 'where':''},
 {'view':"sigra_view.v_socioprodutiva", "name":"Socioprodutiva", 'where':''},
 {'view':" ( SELECT v_cultivo.cod_coleta,v_cultivo.categoria AS Categoria, "+
                  "  v_cultivo.cultura AS Cultura, "+
                  "  v_cultivo.cultura_outros AS Cultura_outro, "+
                  "  v_cultivo.area AS Area, "+
                  "  v_cultivo.sementes_mudas AS Semestes_mudas, "+
                  "  v_cultivo.propria_comprada_doada AS Propria_comprada_doada, "+
                  "  v_cultivo.crioula AS Crioula, "+
                  "  v_cultivo.preparo_solo AS Preparo_solo, "+
                  "  v_cultivo.adubacao_solo AS Adubacao_solo, "+
                  "  v_cultivo.veneno AS Veneno, "+
                  "  v_cultivo.autoconsumo AS Autoconsumo, "+
                  "  v_cultivo.doacao AS Doacao, "+
                  "  v_cultivo.processado_lote AS Processado_lote, "+
                  "  v_cultivo.uso_lote AS uso_lote, "+
                  "  v_cultivo.cooperativa AS Cooperativa, "+
                  "  v_cultivo.vendas_direta AS Venda_direta, "+
                  "  v_cultivo.industria, "+
                  "  v_cultivo.producao AS Producao, "+
                  "  v_cultivo.servicos AS Servico, "+
                  "  v_cultivo.financiamento AS Financiamento "+
                  "  FROM sigra_view.v_cultivo) ", "name":"Cultivo", 'where':''},
  {'view':"sigra_view.v_pa_bl_reproducao", "name":"Reproducao bovino leite", 'where':''},
  {'view':"sigra_view.v_pa_bv_reproducao", "name":"Reproducao bovino corte", 'where':''},
  {'view':"sigra_view.v_pa_pis_finalidade", "name":"Finalidade pisicultura", 'where':''},
  {'view':"sigra_view.v_sanidade_animal", "name":"Sanidade animal doencas", 'where':''},
  {'view':"sigra_view.v_certificacao", "name":"Certificacao", 'where':''},
  {'view':"sigra_view.v_benfeitorias", "name":"Benfeitorias", 'where':''},
  {'view':"sigra_view.v_princ_maq_equip", "name":"Maquinario_Equipamentos", 'where':''},
  {'view':"sigra_view.v_prest_servicos", "name":"Pretacao de servico", 'where':''},
  {'view':"sigra_view.v_car_possui_deficit_rl_regularizar", "name":"Defict RL regularizar", 'where':''},
  {'view':"sigra_view.v_car_possui_deficit_rl_compensar", "name":"Defict RL Compensar", 'where':''},
  {'view':"sigra_view.v_car_existe_tac", "name":"TAC", 'where':''},
  {'view':"sigra_view.v_car_existe_prad", "name":"PRAD", 'where':''},
  {'view':"sigra_view.v_car_possui_excedente_vegetacao_nativa_fazer", "name":"Excedente vegetacao", 'where':''},
  {'view':"sigra_view.v_car_rl_temporalidade", "name":"RL legislacao", 'where':''},
]
//select oid, pg_type.* from pg_type order by oid
async function f() {
  await conn.connect();

  var wb = XLSX.utils.book_new();

  async function book_append_table(wb, name,sheet, where) {
    var string=  "SELECT tmp.* FROM  sigra_view.v_geral,geo_din.loteamento, " +name+ " as tmp "+
    "where tmp.cod_coleta=sigra_view.v_geral.cod_coleta and sigra_view.v_geral.cod_coleta=geo_din.loteamento.cod_coleta and" +
    "( geo_din.loteamento.cod_sipra='MG0313000' or  geo_din.loteamento.cod_sipra='MG0383000' or geo_din.loteamento.cod_sipra='MG0112000' or geo_din.loteamento.cod_sipra='MG0116000' ) "+where+' '
    //console.log(string)
    var r_f = await conn.query(string );
    var r=[];
    var numeric=[]
    r_f.fields.forEach((elem)=>{
      //console.log(elem)
      if(elem.dataTypeID==1700)
        numeric.push(elem)
    })
    //console.log(numeric)
    if(r_f.rows.length>0){
      r_f.rows.forEach((json)=>{
        numeric.forEach((key)=>{
          json[key.name]=parseFloat(json[key.name])
        })
      })
      //console.log(r_f.rows)
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
  XLSX.writeFile(wb, "sigra.xlsx");
  console.log("finish")
}
f().then();
