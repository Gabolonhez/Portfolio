/**
 * Image Optimization Script - Portfolio Gabriel Bolonhez
 * Converte imagens para WebP e gera versões responsivas
 * 
 * Requisito: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Verificar se sharp está instalado
function checkSharp() {
  try {
    require.resolve('sharp');
    return require('sharp');
  } catch (e) {
    console.error('❌ Sharp não instalado!');
    console.error('   Execute: npm install sharp');
    process.exit(1);
  }
}

const sharp = checkSharp();

// Configurações de otimização
const CONFIG = {
  quality: {
    webp: 85,
    jpeg: 85,
    png: 90
  },
  sizes: {
    thumbnail: 400,
    medium: 800,
    large: 1200,
    xlarge: 1600
  }
};

// Função para otimizar uma imagem
async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  
  // Criar diretório de saída se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`\n📸 Otimizando: ${filename}${ext}`);
    console.log(`   Dimensões originais: ${metadata.width}x${metadata.height}`);
    console.log(`   Formato original: ${metadata.format}`);
    
    const stats = [];
    
    // 1. Versão WebP original
    const webpPath = path.join(outputDir, `${filename}.webp`);
    await image
      .webp({ quality: CONFIG.quality.webp })
      .toFile(webpPath);
    
    const webpSize = fs.statSync(webpPath).size;
    const originalSize = fs.statSync(inputPath).size;
    const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    stats.push({
      name: `${filename}.webp`,
      size: webpSize,
      reduction
    });
    
    // 2. Versões responsivas (se a imagem for grande)
    if (metadata.width > 800) {
      for (const [sizeName, width] of Object.entries(CONFIG.sizes)) {
        if (width < metadata.width) {
          const responsivePath = path.join(outputDir, `${filename}-${width}.webp`);
          
          await sharp(inputPath)
            .resize(width, null, { withoutEnlargement: true })
            .webp({ quality: CONFIG.quality.webp })
            .toFile(responsivePath);
          
          const responsiveSize = fs.statSync(responsivePath).size;
          stats.push({
            name: `${filename}-${width}.webp`,
            size: responsiveSize,
            reduction: ((1 - responsiveSize / originalSize) * 100).toFixed(1)
          });
        }
      }
    }
    
    // Exibir estatísticas
    console.log(`   ✅ Original: ${formatBytes(originalSize)}`);
    stats.forEach(stat => {
      console.log(`   ✅ ${stat.name.padEnd(30)} ${formatBytes(stat.size)} (-${stat.reduction}%)`);
    });
    
    return stats;
    
  } catch (error) {
    console.error(`   ❌ Erro ao processar ${filename}: ${error.message}`);
    return [];
  }
}

// Processar diretório de imagens
async function processDirectory(inputDir, outputDir) {
  console.log(`\n🔍 Procurando imagens em: ${inputDir}\n`);
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const files = fs.readdirSync(inputDir);
  
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
  
  if (imageFiles.length === 0) {
    console.log('⚠️  Nenhuma imagem encontrada.');
    return;
  }
  
  console.log(`📊 Encontradas ${imageFiles.length} imagens para otimizar\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const stats = await optimizeImage(inputPath, outputDir);
    
    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;
    
    stats.forEach(stat => {
      totalOptimized += stat.size;
    });
  }
  
  // Relatório final
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 RELATÓRIO FINAL');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total de imagens processadas: ${imageFiles.length}`);
  console.log(`Tamanho original total: ${formatBytes(totalOriginal)}`);
  console.log(`Tamanho otimizado total: ${formatBytes(totalOptimized)}`);
  console.log(`Economia total: ${formatBytes(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════════════════════\n');
}

// Função auxiliar para formatar bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Gerar HTML de exemplo com imagens otimizadas
function generateImageHTML(outputDir) {
  const files = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.webp'))
    .sort();
  
  let html = '<!-- Imagens Otimizadas - Cole no seu HTML -->\n\n';
  
  const grouped = {};
  files.forEach(file => {
    const baseName = file.split('-')[0].replace('.webp', '');
    if (!grouped[baseName]) grouped[baseName] = [];
    grouped[baseName].push(file);
  });
  
  Object.entries(grouped).forEach(([baseName, images]) => {
    if (images.length === 1) {
      // Imagem simples
      html += `<img \n`;
      html += `  class="lazy" \n`;
      html += `  data-src="src/images/optimized/${images[0]}" \n`;
      html += `  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3C/svg%3E"\n`;
      html += `  alt="${baseName}"\n`;
      html += `>\n\n`;
    } else {
      // Imagem responsiva
      const srcset = images
        .filter(img => img.includes('-'))
        .map(img => {
          const width = img.match(/-(\d+)\.webp/)[1];
          return `src/images/optimized/${img} ${width}w`;
        })
        .join(',\n               ');
      
      html += `<img \n`;
      html += `  class="lazy" \n`;
      html += `  data-src="src/images/optimized/${images.find(i => !i.includes('-'))}" \n`;
      html += `  data-srcset="${srcset}"\n`;
      html += `  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"\n`;
      html += `  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3C/svg%3E"\n`;
      html += `  alt="${baseName}"\n`;
      html += `>\n\n`;
    }
  });
  
  const htmlPath = path.join(outputDir, 'images-example.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`📝 Exemplo HTML gerado em: ${htmlPath}\n`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  const inputDir = args[0] || 'src/images';
  const outputDir = args[1] || 'src/images/optimized';
  
  console.log('\n🚀 Image Optimizer - Portfolio Gabriel Bolonhez\n');
  
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Diretório não encontrado: ${inputDir}`);
    process.exit(1);
  }
  
  await processDirectory(inputDir, outputDir);
  generateImageHTML(outputDir);
  
  console.log('✅ Otimização concluída!\n');
  console.log('📋 Próximos passos:');
  console.log('   1. Revise as imagens em: ' + outputDir);
  console.log('   2. Veja o exemplo HTML em: ' + path.join(outputDir, 'images-example.html'));
  console.log('   3. Substitua as imagens no index.html');
  console.log('   4. Adicione a classe "lazy" nas imagens\n');
}

// Executar
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, processDirectory };
