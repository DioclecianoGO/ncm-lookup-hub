const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - permite requisições do frontend
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (pasta "public" = build do React)
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ========================
// API - Consulta NCM
// ========================
app.post('/api/consulta-ncm', async (req, res) => {
  try {
    const { ncm } = req.body;

    // Validar NCM (8 dígitos numéricos)
    if (!ncm || !/^\d{8}$/.test(ncm)) {
      return res.status(400).json({
        error: 'NCM deve conter exatamente 8 dígitos numéricos',
      });
    }

    console.log(`[${new Date().toISOString()}] Buscando NCM: ${ncm}`);

    const apiUrl = `https://servicos.dpf.gov.br/siproquim-mapas-internet-rest/api/tipoNCM/buscarPorNCMOuProduto?arg=${ncm}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: 'Erro ao consultar a API do SIPROQUIM',
      });
    }

    const data = await response.json();
    console.log(`Resultado: ${JSON.stringify(data).substring(0, 200)}...`);

    return res.json(data);
  } catch (error) {
    console.error('Erro na consulta NCM:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// SPA fallback - todas as outras rotas servem o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api/consulta-ncm`);
});
