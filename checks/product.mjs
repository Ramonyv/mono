import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const errors=[];
const dom=new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>',{url:'http://localhost:4175',runScripts:'dangerously',pretendToBeVisual:true});
const w=dom.window;w.structuredClone=structuredClone;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.addEventListener('error',e=>errors.push(e.error));
for(const file of ['icons.js','app.js','product.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),dom.getInternalVMContext(),{filename:file});
const run=s=>vm.runInContext(s,dom.getInternalVMContext());
assert.match(w.document.body.textContent,/Good morning/);
for(const page of ['Projects','Clients','Tasks','Calendar','Invoices','Expenses','Budget','Investments','Notes','Meetings']){
 run(`navigate('${page}')`);assert.ok(w.document.querySelector('.reference-header'),page+' header');assert.ok(w.document.body.textContent.length>500,page+' content');console.log('Render:',page);
 if(['Projects','Clients','Tasks','Invoices','Expenses'].includes(page))assert.ok(w.document.querySelector('tbody tr'),page+' rows');
 if(['Projects','Clients','Tasks','Invoices','Expenses','Notes','Meetings','Calendar'].includes(page))assert.ok(!w.document.body.innerHTML.includes('undefined'),page+' undefined data');
}
for(const page of ['Invoices','Expenses','Budget','Investments','Notes','Meetings','Calendar']){run(`startEditor('${page}')`);assert.ok(w.document.getElementById('record-form'),page+' form');assert.ok(w.document.getElementById('preview-panel'),page+' preview');console.log('Editor:',page);run('cancelEditor()')}
run("navigate('Tasks');setView('Board')");assert.ok(w.document.querySelector('.kanban'));
run("setView('List');setFilter('search','homepage')");assert.equal(w.document.querySelectorAll('tbody tr').length,1);
run("clearFilters();selectRecord('t0');toggleChecklist('subtasks',2,true)");assert.ok(run("selected().done.includes(2)"));
run("navigate('Invoices');startEditor('Invoices');editInvoiceItem(0,'rate',70000)");assert.equal(run('editorState.record.amount'),100000);
run("editorState.record.title='INV-TEST';saveEditor()");assert.ok(run("db().invoices.some(i=>i.title==='INV-TEST')"));
run("startEditor('Notes');editorState.record.title='Test note';document.querySelector('[name=title]').value='Test note';editorState.record.content='<p>Saved content</p>';saveEditor()");assert.ok(run("db().notes.some(n=>n.title==='Test note')"));
run("navigate('Tasks');startEditor('Tasks')");let form=w.document.getElementById('quick-form');form.elements.title.value='Integration test task';form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.ok(run("db().tasks.some(t=>t.title==='Integration test task')"));
run('workspaceMenu()');let wf=w.document.querySelector('.workspace-menu form');wf.elements.workspaceName.value='New blank workspace';w.__workspaceForm=wf;run('createWorkspace({preventDefault(){},target:window.__workspaceForm})');assert.equal(run('db().projects.length'),0);assert.equal(run('db().tasks.length'),0);
run("switchWorkspace('demo')");assert.ok(run('db().projects.length')>=8);
await Promise.resolve();
run("navigate('Projects')");w.document.querySelector('.header-actions .primary').click();assert.ok(w.document.querySelector('.modal'),'New project opens Quick Add');w.document.querySelector('.modal header button').click();assert.equal(run('editorState'),null,'Cancel closes quick editor');
run("navigate('Expenses');startEditor('Expenses')");const title=w.document.querySelector('[name=title]');title.value='Saved expense';title.dispatchEvent(new w.Event('input',{bubbles:true}));const amount=w.document.querySelector('[name=amount]');amount.value='1250';amount.dispatchEvent(new w.Event('input',{bubbles:true}));assert.ok(w.document.querySelector('.expense-preview').textContent.includes('1,250'));run("editorState.record.client='Pixel Studio';editorState.record.project='Website Redesign'");w.document.querySelector('.editor-preview button[type=submit]').click();assert.ok(run("db().expenses.some(e=>e.title==='Saved expense')"),'Expense preview footer submits form');
assert.equal(errors.length,0,errors.map(e=>e?.stack).join('\n'));
console.log('PASS: screen rendering, forms, filtering, task state, invoice calculation, persistence, and workspace isolation');
run('buttonObserver.disconnect()');dom.window.close();
