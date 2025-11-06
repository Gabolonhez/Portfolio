/**
 * Build Script - Portfolio Gabriel Bolonhez
 * Minifica CSS e JavaScript para produção
 */

const fs = require('fs');
const path = require('path');

// Função para verificar se um pacote está instalado
function checkDependencies() {
  const required = ['terser', 'clean-css'];
  const missing = [];
  
  for (const pkg of required) {
    try {
      require.resolve(pkg);
    } catch (e) {
      missing.push(pkg);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Pacotes necessários não encontrados:');
    console.error(`   npm install ${missing.join(' ')}`);
    process.exit(1);
  }
}

// Minificar JavaScript
async function minifyJS() {
  const { minify } = require('terser');
  
  const jsFiles = [
    'src/js/main.js',
    'src/js/hero.js',
    'src/js/portfolio.js',
    'src/js/about.js',
    'src/js/lazyLoading.js',
    'src/js/acordeon.js',
    'src/js/api.js',
    'src/js/changeLanguage.js',
    'src/js/changeTheme.js',
    'src/js/scripts.js',
    'src/js/enhancements.js'
  ];
  
  console.log('\n📦 Minificando JavaScript...\n');
  
  let totalOriginal = 0;
  let totalMinified = 0;
  
  for (const file of jsFiles) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  ${file} não encontrado, pulando...`);
      continue;
    }
    
    const code = fs.readFileSync(file, 'utf8');
    const originalSize = Buffer.byteLength(code, 'utf8');
    
    try {
      const result = await minify(code, {
        compress: {
          dead_code: true,
          drop_console: false, // Manter console.log em produção? false = sim
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug']
        },
        mangle: true,
        format: {
          comments: false
        }
      });
      
      if (result.code) {
        const minFile = file.replace('.js', '.min.js');
        fs.writeFileSync(minFile, result.code);
        
        const minifiedSize = Buffer.byteLength(result.code, 'utf8');
        const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
        
        totalOriginal += originalSize;
        totalMinified += minifiedSize;
        
        console.log(`✅ ${file.padEnd(35)} ${formatBytes(originalSize)} → ${formatBytes(minifiedSize)} (-${reduction}%)`);
      }
    } catch (error) {
      console.error(`❌ Erro ao minificar ${file}:`, error.message);
    }
  }
  
  const totalReduction = ((1 - totalMinified / totalOriginal) * 100).toFixed(1);
  console.log(`\n📊 Total JS: ${formatBytes(totalOriginal)} → ${formatBytes(totalMinified)} (-${totalReduction}%)\n`);
}

// Minificar CSS
function minifyCSS() {
  const CleanCSS = require('clean-css');
  
  const cssDir = 'src/css';
  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && !f.endsWith('.min.css'));
  
  console.log('🎨 Minificando CSS...\n');
  
  let totalOriginal = 0;
  let totalMinified = 0;
  
  cssFiles.forEach(file => {
    const filePath = path.join(cssDir, file);
    const input = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(input, 'utf8');
    
    const output = new CleanCSS({
      level: 2,
      format: false
    }).minify(input);
    
    if (output.errors.length > 0) {
      console.error(`❌ Erro ao minificar ${file}:`, output.errors);
      return;
    }
    
    const minFile = file.replace('.css', '.min.css');
    const minFilePath = path.join(cssDir, minFile);
    fs.writeFileSync(minFilePath, output.styles);
    
    const minifiedSize = Buffer.byteLength(output.styles, 'utf8');
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    
    totalOriginal += originalSize;
    totalMinified += minifiedSize;
    
    console.log(`✅ ${file.padEnd(30)} ${formatBytes(originalSize)} → ${formatBytes(minifiedSize)} (-${reduction}%)`);
  });
  
  const totalReduction = ((1 - totalMinified / totalOriginal) * 100).toFixed(1);
  console.log(`\n📊 Total CSS: ${formatBytes(totalOriginal)} → ${formatBytes(totalMinified)} (-${totalReduction}%)\n`);
}

// Função auxiliar para formatar bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Criar versão de produção do index.html
function createProductionHTML() {
  console.log('📄 Criando index de produção...\n');
  
  let html = fs.readFileSync('index.html', 'utf8');
  
  // Substituir arquivos .css por .min.css
  html = html.replace(/href="src\/css\/(\w+)\.css"/g, 'href="src/css/$1.min.css"');
  
  // Substituir arquivos .js por .min.js
  html = html.replace(/src="src\/js\/(\w+)\.js"/g, 'src="src/js/$1.min.js"');
  
  // Adicionar comentário de build
  const buildDate = new Date().toISOString();
  html = html.replace('</head>', `  <!-- Build: ${buildDate} -->\n</head>`);
  
  fs.writeFileSync('index.prod.html', html);
  console.log('✅ index.prod.html criado com sucesso!\n');
}

// Gerar relatório
function generateReport() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('✨ Build concluído com sucesso!');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Revise os arquivos .min.js e .min.css');
  console.log('   2. Teste com: npm start');
  console.log('   3. Substitua index.html por index.prod.html para produção');
  console.log('   4. Rode Lighthouse: npm run lighthouse');
  console.log('\n💡 Dica: Otimize imagens com https://squoosh.app/');
  console.log('');
}

// Executar build
async function build() {
  console.log('\n🚀 Iniciando build do portfolio...\n');
  
  checkDependencies();
  
  try {
    await minifyJS();
    minifyCSS();
    createProductionHTML();
    generateReport();
  } catch (error) {
    console.error('\n❌ Erro durante o build:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  build();
}

module.exports = { build, minifyJS, minifyCSS };
