'use strict';

// Os registros pertencem ao navegador e são compartilhados pelas três telas.
const STORAGE_KEY = 'servipro.orcamentos.v3';
const statuses = { pendente: ['Pendente', 'pending'], aprovado: ['Aprovado', 'approved'], recusado: ['Recusado', 'rejected'] };
const fields = ['cliente', 'telefone', 'cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'descricao', 'valor', 'data', 'status', 'observacoes'];
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (value) => value.split('-').reverse().join('/');
let storageFailed = false;
function feedback(message, error = false) {
    const element = $('#feedback');
    element.hidden = false;
    element.className = error ? 'notice error' : 'notice';
    element.textContent = message;
}
function readItems() {
    try {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(items) || items.some(item => !item || typeof item.id !== 'string' || fields.some(field => field === 'valor' ? !Number.isFinite(item.valor) || item.valor < 0 : typeof item[field] !== 'string') || !statuses[item.status] || !/^\d{4}-\d{2}-\d{2}$/.test(item.data))) throw new Error('Dados inválidos');
        return items;
    } catch {
        storageFailed = true;
        feedback('Não foi possível ler os dados salvos. Verifique as permissões de armazenamento do navegador. Os dados existentes não serão sobrescritos.', true);
        return [];
    }
}
let items = readItems();
function saveItems(next) {
    if (storageFailed) return false;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        items = next;
        return true;
    } catch {
        feedback('Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado. Seus dados não foram alterados.', true);
        return false;
    }
}
function removeItem(id) {
    const item = items.find(item => item.id === id);
    if (!item || !confirm(`Excluir o orçamento de ${item.cliente}? Esta ação não pode ser desfeita.`)) return false;
    return saveItems(items.filter(item => item.id !== id));
}
const badge = (status) => `<span class="badge ${statuses[status][1]}">${statuses[status][0]}</span>`;
function renderList() {
    const query = normalize($('#pesquisa').value);
    const filtered = items.filter(item => (!$('#filtro-status').value || item.status === $('#filtro-status').value) && normalize(`${item.cliente} ${item.descricao}`).includes(query));
    const order = $('#ordenacao').value;
    filtered.sort((a, b) => order === 'menor-valor' ? a.valor - b.valor : order === 'maior-valor' ? b.valor - a.valor : order === 'mais-antigos' ? a.data.localeCompare(b.data) : b.data.localeCompare(a.data));
    $('#orcamentos').innerHTML = filtered.map(item => `<tr>
        <th scope="row" data-label="Cliente">${escapeHTML(item.cliente)}</th>
        <td data-label="Serviço">${escapeHTML(item.descricao)}</td>
        <td data-label="Data">${date(item.data)}</td><td data-label="Valor">${money(item.valor)}</td>
        <td data-label="Status">${badge(item.status)}</td><td data-label="Ações">
        <a href="pages/detalhes.html?id=${encodeURIComponent(item.id)}">Ver detalhes</a>
        <a class="button" href="pages/cadastro.html?id=${encodeURIComponent(item.id)}">Editar</a>
        <button class="danger" data-delete="${escapeHTML(item.id)}" type="button">Excluir</button></td></tr>`).join('');
    $('#contagem').textContent = `${filtered.length} de ${items.length} orçamento(s).${filtered.length ? '' : ' Nenhum orçamento encontrado.'}`;
    $('#total').textContent = items.length;
    Object.keys(statuses).forEach(status => $(`#${status}`).textContent = items.filter(item => item.status === status).length);
}
function normalize(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
if ($('#orcamentos')) {
    renderList();
    $('#pesquisa').addEventListener('input', renderList);
    ['#filtro-status', '#ordenacao'].forEach(selector => $(selector).addEventListener('change', renderList));
    $('#pesquisa').form.addEventListener('submit', event => { event.preventDefault(); renderList(); });
    $('#orcamentos').addEventListener('click', event => {
        const button = event.target.closest('[data-delete]');
        if (button && removeItem(button.dataset.delete)) { renderList(); feedback('Orçamento excluído.'); }
    });
}
const id = new URLSearchParams(location.search).get('id');
if ($('.budget-form')) {
    const form = $('.budget-form');
    const existing = items.find(item => item.id === id);
    if (id && !existing) {
        feedback('Orçamento não encontrado. Volte à listagem para selecionar um registro.', true);
        form.querySelector('[type="submit"]').disabled = true;
    }
    if (existing) {
        $('#titulo-cadastro').textContent = 'Editar orçamento';
        document.title = 'ServiPro — Editar orçamento';
        fields.forEach(field => form.elements[field].value = existing[field]);
    } else {
        const today = new Date();
        $('#data').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
    form.addEventListener('submit', event => {
        event.preventDefault();
        for (const field of fields) {
            const input = form.elements[field];
            input.setCustomValidity('');
            if (input.required && !input.value.trim()) input.setCustomValidity('Preencha este campo.');
        }
        if (!/^\d{10,11}$/.test($('#telefone').value.replace(/\D/g, ''))) $('#telefone').setCustomValidity('Informe um telefone com DDD e 10 ou 11 dígitos.');
        if (!/^\d{8}$/.test($('#cep').value.replace(/\D/g, ''))) $('#cep').setCustomValidity('Informe um CEP com 8 dígitos.');
        if (!form.reportValidity()) return;
        const item = Object.fromEntries(fields.map(field => [field, form.elements[field].value.trim()]));
        item.valor = Number(item.valor);
        item.id = existing ? existing.id : crypto.randomUUID();
        const next = existing ? items.map(old => old.id === id ? item : old) : [...items, item];
        if (saveItems(next)) location.href = `detalhes.html?id=${encodeURIComponent(item.id)}&salvo=1`;
    });
    form.addEventListener('input', event => event.target.setCustomValidity?.(''));
}
if ($('#detalhes')) {
    const item = items.find(item => item.id === id);
    if (!item) {
        $('#detalhes').innerHTML = '<h2 id="titulo-detalhes">Orçamento não encontrado</h2><p>Selecione um orçamento na listagem.</p>';
    } else {
        const section = (title, entries) => `<section><h3>${title}</h3><dl>${entries.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHTML(value || 'Não informado')}</dd></div>`).join('')}</dl></section>`;
        $('#detalhes').innerHTML = `<header><h2 id="titulo-detalhes">Orçamento de ${escapeHTML(item.cliente)}</h2>${badge(item.status)}</header>`
            + section('Resumo do orçamento', [['Serviço', item.descricao], ['Valor', money(item.valor)], ['Data', date(item.data)]])
            + section('Dados do cliente', [['Nome', item.cliente], ['Telefone', item.telefone]])
            + section('Endereço do serviço', [['CEP', item.cep], ['Rua', item.rua], ['Número', item.numero], ['Complemento', item.complemento], ['Bairro', item.bairro], ['Cidade', item.cidade], ['Estado', item.estado]])
            + section('Observações', [['Observações', item.observacoes]])
            + `<footer><a class="button primary" href="cadastro.html?id=${encodeURIComponent(item.id)}">Editar orçamento</a><button class="danger" id="excluir" type="button">Excluir orçamento</button><a href="../index.html">Voltar</a></footer>`;
        $('#excluir').addEventListener('click', () => { if (removeItem(id)) location.href = '../index.html'; });
        if (new URLSearchParams(location.search).has('salvo')) feedback('Orçamento salvo com sucesso.');
    }
}
