/* Pure functions shared by the lessons, spreadsheet simulator and tests. */
(function(root){
'use strict';
function divisions(number){const rows=[];let n=number;do{const q=Math.floor(n/2);rows.push({n,q,r:n%2});n=q;}while(n>0);return rows;}
function positional(bits){return [...bits].map((b,i)=>({bit:Number(b),position:bits.length-i-1,weight:2**(bits.length-i-1),contribution:Number(b)*2**(bits.length-i-1)}));}
function colNumber(name){return [...name].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0)}
function colName(n){let out='';while(n){n--;out=String.fromCharCode(65+n%26)+out;n=Math.floor(n/26)}return out}
function range(a,b){const pa=/^([A-Z]+)(\d+)$/.exec(a),pb=/^([A-Z]+)(\d+)$/.exec(b);if(!pa||!pb)throw Error('Intervallo non valido');if(colNumber(pa[1])>26||colNumber(pb[1])>26||+pa[2]<1||+pb[2]>100||colNumber(pa[1])>colNumber(pb[1])||+pa[2]>+pb[2])throw Error('Intervallo fuori dal laboratorio (A1:Z100)');let out=[];for(let r=+pa[2];r<=+pb[2];r++)for(let c=colNumber(pa[1]);c<=colNumber(pb[1]);c++)out.push(colName(c)+r);return out;}
function shift(formula,dc,dr){return formula.replace(/(\$?)([A-Z]+)(\$?)(\d+)/g,(_,ac,c,ar,r)=>ac+colName(colNumber(c)+(ac?0:dc))+ar+(+r+(ar?0:dr)));}
// Restricted parser: no eval, network access or arbitrary JavaScript execution.
function evaluate(raw,cells,seen=new Set()){
 if(raw===undefined||raw==='')return 0;if(typeof raw==='number')return raw;if(!raw.startsWith('=')){if(/^\d+$/.test(raw))return Number(raw);return raw;}
 const source=raw.slice(1).toUpperCase().replace(/\s+/g,'');const tokens=source.match(/\$?[A-Z]+\$?\d+|[A-Z.]+|\d+(?:\.\d+)?|[()+\-*/^:;,]/g)||[];
 if(tokens.join('')!==source)throw Error('Simbolo non supportato');let p=0;
 function take(t){if(tokens[p]!==t)throw Error('Atteso '+t);p++;}
 function ref(k){k=k.replace(/\$/g,'');if(seen.has(k))throw Error('Riferimento circolare');let next=new Set(seen);next.add(k);return evaluate(cells[k],cells,next);}
 function numeric(x){if(Array.isArray(x))throw Error('Qui serve una sola cella');const n=Number(x);if(!Number.isFinite(n))throw Error('Valore non numerico');return n;}
 function primary(){let t=tokens[p++];if(!t)throw Error('Formula incompleta');if(t==='('){let v=expr();take(')');return v}if(t==='-')return -numeric(primary());if(/^\d/.test(t))return +t;if(/^\$?[A-Z]+\$?\d+$/.test(t)){if(tokens[p]===':'){p++;let end=tokens[p++];return range(t.replace(/\$/g,''),end.replace(/\$/g,'')).map(ref)}return ref(t)}if(/^[A-Z.]+$/.test(t)){take('(');let args=[];if(tokens[p]!==')'){args.push(expr());while(tokens[p]===';'||tokens[p]===','){p++;args.push(expr())}}take(')');const flat=args.flat();switch(t){case'INT':if(args.length!==1)throw Error('INT richiede 1 argomento');return Math.floor(numeric(args[0]));case'RESTO':case'MOD':if(args.length!==2)throw Error('RESTO richiede 2 argomenti');if(numeric(args[1])===0)throw Error('Divisione per zero');return numeric(args[0])-numeric(args[1])*Math.floor(numeric(args[0])/numeric(args[1]));case'SOMMA':case'SUM':return flat.reduce((s,x)=>s+numeric(x),0);case'CONCATENA':case'CONCATENATE':return flat.join('');default:throw Error('Funzione non supportata nel simulatore')}}throw Error('Formula non valida');}
 function power(){let v=primary();if(tokens[p]==='^'){p++;v=numeric(v)**numeric(power())}return v}
 function mul(){let v=power();while(tokens[p]==='*'||tokens[p]==='/'){let op=tokens[p++],b=numeric(power());if(op==='/'&&b===0)throw Error('Divisione per zero');v=op==='*'?numeric(v)*b:numeric(v)/b;}return v}
 function expr(){let v=mul();while(tokens[p]==='+'||tokens[p]==='-'){let op=tokens[p++],b=numeric(mul());v=op==='+'?numeric(v)+b:numeric(v)-b;}return v}
 const result=expr();if(p!==tokens.length)throw Error('Controlla parentesi e separatori');if(typeof result==='number'&&!Number.isFinite(result))throw Error('Risultato non valido');return result;
}
const api={divisions,positional,range,shift,evaluate,colName};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.BinaryMath=api;
})(typeof window!=='undefined'?window:globalThis);
