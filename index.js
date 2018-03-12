const forEach = require('lodash/forEach');
const isArray = require('lodash/isArray');
const merge = require('lodash/merge');

function toArray(chunk) {
  return isArray(chunk) ? chunk : [chunk];
}

function resolveChunks(chunks = {}, order = []) {
  const js = [], css = [];
  forEach(order, function (name) {
    const chunk = toArray(chunks[name]);
    chunk.forEach(c => {
      if (c.endsWith('.js')) {
        js.push(`<script src="/${c}"></script>`);
      } else if (c.endsWith('.css')) {
        css.push(`<link rel="stylesheet" href="/${c}" />`);
      }
    })
  });
  return {js, css};
}

function Render(chunks, order) {
  this.tags = {
    title: '<div>Render</div>',
    links: [],
    metas: [],
    js: [],
    css: []
  };
  this.tags = merge(this.tags, resolveChunks(chunks, order));
}

Render.prototype.title = function (title) {
  this.tags.title = `<title>${title || 'Render'}</title>`;
  return this;
};

Render.prototype.meta = function ({charset, name, content}) {
  this.tags.metas.push(`<meta charset="${charset}" name="${name}" content="${content}">`);
  return this;
};

Render.prototype.link = function ({rel, href}) {
  this.tags.links.push(`<link rel="${rel}" href="${href}" />`);
  return this;
};

Render.prototype.container = function (tag, id) {
  this.tags.container = `<${tag} id="${id || 'app'}"></${tag}>`;
  return this;
};

Render.prototype.toString = function () {
  return `
<html>
<head>
${this.tags.metas.join('\n')}
${this.tags.links.join('\n')}
${this.tags.title}
${this.tags.css.join('\n')}
</head>
<body>
${this.tags.container}
${this.tags.js.join('\n')}
</body>
</html>		
  `
};

module.exports = Render;
module.exports.default = Render;
