# TTS API Spec

## Setup

This should probably be run once, when building for prod and then exported to a `JSON` file.

### Scrape the faculty acronyms

`https://sigarra.up.pt/up/pt/web_base.gera_pagina?p_pagina=escolas`

(This step can be hardcoded. Faculty acronyms are not likely to change and if there is any new faculty, we'll prolly know about it)

**Result:**

```
[
  faup,
  fbaup,
  fcup, 
  fcnaup, 
  fadeup, 
  fdup, 
  fep, 
  feup, 
  ffup, 
  flup, 
  fmup, 
  fmdup,
  fpceup,
  icbas,
  pbs
]
```

### Scrape the faculty IDs (`inst_id`)

`https://sigarra.up.pt/{faculty_acronym}/pt/UCURR_GERAL.PESQUISA_UCS`

> **faculty_acronym**: self-explanatory 

Using the `input[name="pv_search_inst_id"]` selector, the `value` attribute of the input represents the `inst_id`. This input element is inside a `<script>`, so depending on the DOM parser being used, the selector may have to be run within the scope of the `<script>`. This can be achieved using the `script[data-lov-template-zone="search"]` selector and using the element's `innerHTML`.

**Result:**
```
{ 
  fcup: '18493',
  feup: '18490',
  flup: '18492',
  fep: '18491',
  fdup: '18487',
  ffup: '18381',
  faup: '18380',
  fcnaup: '18379',
  fadeup: '18383',
  fmup: '18494',
  fbaup: '18395',
  fmdup: '18384',
  fpceup: '18489',
  icbas: '18382' 
}
```
## API

### Fetch faculty courses

Returns `JSON`

```
https://sigarra.up.pt/{faculty_acronym}/pt/cur_lov_geral.get_json_cursos_ga?
pv_search_inst_adm=
&pv_search_alect={schoolYear}
&pv_search_inst_id={inst_id}
&pv_search_cod=
&pv_search_nome=
&pv_search_sigla=
```

> **faculty_acronym**: self-explanatory  
**school_year**: current school year (e.g. for 2019/2020, value is 2019)  
**inst_id**: faculty ID (e.g. for FEUP, value is 18490)  
**⚠️ALL OTHER PARAMS ARE REQUIRED AND MUST BE LEFT BLANK ⚠️**

**Example:**

[**This year's feup courses**](https://sigarra.up.pt/feup/pt/cur_lov_geral.get_json_cursos_ga?pv_search_inst_adm=&pv_search_alect=2019&pv_search_inst_id=18490&pv_search_cod=&pv_search_nome=&pv_search_sigla=)
```
GET https://sigarra.up.pt/feup/pt/cur_lov_geral.get_json_cursos_ga?
pv_search_inst_adm=
&pv_search_alect=2019
&pv_search_inst_id=18490
&pv_search_cod=
&pv_search_nome=
&pv_search_sigla=
```

**Result:**
```json
{ 
  "completeSetCount": 137, 
  "data": [ 
    {
      "tipo": "Mestrado Integrado",
      "codigo": "9459",
      "sigla": "MIEIC",
      "nome": "Mestrado Integrado em Engenharia Informática e Computação",
      "id": "742"
    },
    ...
  ]
}
```

### Fetch course UCs

Since the API uses pagination, variuous requests are needed to fetch all UCs.

Returns `JSON`

```
https://sigarra.up.pt/{faculty_acronym}/pt/mob_ucurr_geral.pesquisa?
pv_ano_lectivo={school_year}
&pv_curso_id={course_id}
&pv_pag={page_number}
```

> **faculty_acronym**: self-explanatory  
**school_year**: current school year (e.g. for 2019/2020, value is 2019)  
**course_id**: course ID (e.g. for MIEIC, value is 742)  
**page_number?**: page number since pagination is used in the API (this is a 1-based index and can be left blank to fetch the first page)

**Example:**

[**This year's MIEIC UCs**](https://sigarra.up.pt/feup/pt/mob_ucurr_geral.pesquisa?pv_ano_lectivo=2019&pv_curso_id=742)

```
GET https://sigarra.up.pt/feup/pt/mob_ucurr_geral.pesquisa?
pv_ano_lectivo=2019
&pv_curso_id=742
```

**Result:**
```json
{
  "total":73,
  "pagina":"1",
  "tam_pagina":20,
  "resultados":[
    {
      "ocorr_id":436459,
      "codigo":"EIC0048",
      "nome":"Arquitectura de Sistemas de Software",
      "name":"Software Systems Architecture",
      "ano_lectivo":2019,
      "periodo":"2S",
      "data_inicio":"",
      "data_fim":""
    },
    ...
  ]
}
```