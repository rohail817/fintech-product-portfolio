import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { runAgreementEngine } from './collateral-engine.ts';
const fixture=JSON.parse(await fs.readFile(new URL('./collateral-reference.json',import.meta.url),'utf8'));
const request=()=>structuredClone({ruleVersion:fixture.ruleVersion,inputSnapshot:fixture.inputSnapshot});
test('reference case: exact borrowing base and eligible basis',async()=>{
 const r=await runAgreementEngine(request());
 assert.equal(r.status,'succeeded');
 assert.equal(r.outputs.eligibleBasisCents,'65000000');
 assert.equal(r.outputs.borrowingBaseCents,'50500000');
 assert.equal(r.blockingErrors.length,0);
});
test('a lower advance rate changes the calculated result and replay fingerprint',async()=>{
 const original=request(); const changed=request();changed.ruleVersion.rules.find(r=>r.ruleCode==='spec_advance').numericValue=6500;
 const [a,b]=await Promise.all([runAgreementEngine(original),runAgreementEngine(changed)]);
 assert.equal(b.outputs.borrowingBaseCents,'47500000');assert.notEqual(a.replayHash,b.replayHash);
});
test('replaying the same authoritative inputs gives the same fingerprint',async()=>{
 const [a,b]=await Promise.all([runAgreementEngine(request()),runAgreementEngine(request())]);assert.equal(a.replayHash,b.replayHash);assert.deepEqual(a.outputs,b.outputs);
});
test('missing required evidence blocks calculation',async()=>{
 const r=request();r.inputSnapshot.units[0].documentedCost=null;
 const result=await runAgreementEngine(r);assert.equal(result.status,'blocked');assert.ok(result.blockingErrors.length>0);
});
test('an unapproved rule version blocks calculation',async()=>{
 const r=request();r.ruleVersion.ruleVersionStatus='draft';
 const result=await runAgreementEngine(r);assert.equal(result.status,'blocked');assert.ok(result.blockingErrors.length>0);
});
