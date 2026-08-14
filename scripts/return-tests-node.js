const http = require('http');
const fs = require('fs');
const tests = [
  {name:'NS-90001 eligible',body:{order_id:'NS-90001',item_id:'NS-90001-ITEM1',reason:'Wrong size',condition:'New, unused, original packaging'},expect:true},
  {name:'NS-90002 outside window',body:{order_id:'NS-90002',item_id:'NS-90002-ITEM1',reason:'Changed mind',condition:'New, unused, original packaging'},expect:false},
  {name:'NS-90003 not delivered',body:{order_id:'NS-90003',item_id:'NS-90003-ITEM1',reason:'Defective',condition:'New, unused, original packaging'},expect:false},
  {name:'NS-90004 final sale',body:{order_id:'NS-90004',item_id:'NS-90004-ITEM1',reason:'Wrong item',condition:'New, unused, original packaging'},expect:false},
  {name:'NS-90005 delivered today',body:{order_id:'NS-90005',item_id:'NS-90005-ITEM1',reason:'Wrong size',condition:'New, unused, original packaging'},expect:true},
  {name:'NS-90006 in transit',body:{order_id:'NS-90006',item_id:'NS-90006-ITEM1',reason:'Changed mind',condition:'New, unused, original packaging'},expect:false},
  {name:'NS-90007 window fails before final_sale',body:{order_id:'NS-90007',item_id:'NS-90007-ITEM1',reason:'Damaged',condition:'New, unused, original packaging'},expect:false},
  {name:'Missing reason',body:{order_id:'NS-90001',item_id:'NS-90001-ITEM1',reason:'',condition:'New, unused, original packaging'},expect:false},
  {name:'Invalid condition',body:{order_id:'NS-90001',item_id:'NS-90001-ITEM1',reason:'Wrong color',condition:'Used'},expect:false}
];

function postJSON(port, path, obj){
  const data = JSON.stringify(obj);
  return new Promise((resolve)=>{
    const options = { hostname: 'localhost', port, path, method: 'POST', headers: {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)} };
    const req = http.request(options, res=>{
      let body=''; res.setEncoding('utf8'); res.on('data', c=>body+=c); res.on('end', ()=>{
        try{ resolve({status: res.statusCode, body: JSON.parse(body)}); } catch(e){ resolve({status: res.statusCode, body: body}); }
      });
    });
    req.on('error', e=> resolve({error: e.message}));
    req.write(data); req.end();
  });
}

(async ()=>{
  const results = [];
  for(const t of tests){
    let ok=false; let res=null;
    for(const p of [3000,3001,3002]){
      res = await postJSON(p, '/api/return-eligibility', t.body);
      if(!res.error){ ok=true; break; }
    }
    if(!ok){ results.push({test: t.name, error: 'no server', pass: false}); continue; }
    const eligible = res.body && res.body.eligible === true;
    const pass = eligible === t.expect;
    results.push({test: t.name, status: res.status, response: res.body, pass});
  }
  fs.writeFileSync('scripts/return-tests-node-output.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
