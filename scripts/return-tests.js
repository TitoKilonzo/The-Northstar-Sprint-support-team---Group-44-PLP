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

(async ()=>{
  const results = [];
  for(const t of tests){
    let res=null; let ok=false;
    for(const p of [3000,3001,3002]){
      try{
        const r = await fetch(`http://localhost:${p}/api/return-eligibility`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t.body),
        });
        const js = await r.json();
        res = { status: r.status, body: js };
        ok = true;
        break;
      }catch(e){/*try next port*/}
    }
    if(!ok){ results.push({ test: t.name, error: 'no server', pass: false }); continue; }
    const eligible = res.body && res.body.eligible === true;
    const pass = eligible === t.expect;
    results.push({ test: t.name, status: res.status, response: res.body, pass });
  }
  const fs = require('fs');
  fs.writeFileSync('scripts/return-tests-output.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
