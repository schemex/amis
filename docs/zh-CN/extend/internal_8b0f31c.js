amis.define('docs/zh-CN/extend/internal.md', function(require, exports, module, define) {

  module.exports = {
    "title": "工作原理",
    "html": "<div class=\"markdown-body\"><p>实现自定义类型需要了解 amis 的工作原理。</p>\n<h2><a class=\"anchor\" name=\"%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86\" href=\"#%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>工作原理</h2><p>amis 的渲染过程是将 <code>json</code> 转成对应的 React 组件。先通过 <code>json</code> 的 type 找到对应的 <code>Component</code>，然后把其他属性作为 <code>props</code> 传递过去完成渲染。</p>\n<p>拿一个表单页面来说，如果用 React 组件开发一般长这样。</p>\n<pre><code class=\"language-jsx\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token class-name\">Page</span></span> <span class=\"token attr-name\">title</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>页面标题<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">subTitle</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>副标题<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n  </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token class-name\">Form</span></span> <span class=\"token attr-name\">title</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>用户登录<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n    </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token class-name\">InputText</span></span> <span class=\"token attr-name\">name</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>username<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">label</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>用户名<span class=\"token punctuation\">\"</span></span> <span class=\"token punctuation\">/></span></span><span class=\"token plain-text\">\n  </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token class-name\">Form</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n</span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token class-name\">Page</span></span><span class=\"token punctuation\">></span></span>\n</code></pre>\n<p>把以上配置方式换成 amis JSON, 则是：</p>\n<pre><code class=\"language-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"page\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"title\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"页面标题\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"subTitle\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"副标题\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"body\"</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"form\"</span><span class=\"token punctuation\">,</span>\n    <span class=\"token property\">\"title\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"用户登录\"</span><span class=\"token punctuation\">,</span>\n    <span class=\"token property\">\"body\"</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">[</span>\n      <span class=\"token punctuation\">{</span>\n        <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"input-text\"</span><span class=\"token punctuation\">,</span>\n        <span class=\"token property\">\"name\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"username\"</span><span class=\"token punctuation\">,</span>\n        <span class=\"token property\">\"label\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"用户名\"</span>\n      <span class=\"token punctuation\">}</span>\n    <span class=\"token punctuation\">]</span>\n  <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<p>其实只需要把 json 节点，根据 type 信息自动转成 React Component 即可。</p>\n<blockquote>\n<p>原来组件注册是根据节点 path 注册，可以类型相同在不同的上下文中用不同的渲染器去渲染，后来发现这样反而增加了使用成本\n所以新版本直接通过 type 类型来注册组件，跟节点所在上下文无关。</p>\n</blockquote>\n<p>Page 组件的示例代码</p>\n<pre><code class=\"language-jsx\"><span class=\"token keyword\">import</span> <span class=\"token operator\">*</span> <span class=\"token keyword\">as</span> React <span class=\"token keyword\">from</span> <span class=\"token string\">'react'</span><span class=\"token punctuation\">;</span>\n<span class=\"token keyword\">import</span> <span class=\"token punctuation\">{</span>Renderer<span class=\"token punctuation\">}</span> <span class=\"token keyword\">from</span> <span class=\"token string\">'amis'</span><span class=\"token punctuation\">;</span>\n\n@<span class=\"token function\">Renderer</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>\n  <span class=\"token literal-property property\">type</span><span class=\"token operator\">:</span> <span class=\"token string\">'page'</span>\n  <span class=\"token comment\">// ... 其他信息隐藏了</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span>\n<span class=\"token keyword\">export</span> <span class=\"token keyword\">class</span> <span class=\"token class-name\">PageRenderer</span> <span class=\"token keyword\">extends</span> <span class=\"token class-name\">React<span class=\"token punctuation\">.</span>Component</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token comment\">// ... 其他信息隐藏了</span>\n  <span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token keyword\">const</span> <span class=\"token punctuation\">{</span>\n      title<span class=\"token punctuation\">,</span>\n      body<span class=\"token punctuation\">,</span>\n      render <span class=\"token comment\">// 用来渲染孩子节点，如果当前是叶子节点则可以忽略。</span>\n    <span class=\"token punctuation\">}</span> <span class=\"token operator\">=</span> <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>props<span class=\"token punctuation\">;</span>\n    <span class=\"token keyword\">return</span> <span class=\"token punctuation\">(</span>\n      <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">className</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>page<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n        </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>h1</span><span class=\"token punctuation\">></span></span><span class=\"token punctuation\">{</span>title<span class=\"token punctuation\">}</span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>h1</span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n        </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">className</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>body-container<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n          </span><span class=\"token punctuation\">{</span><span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token string\">'body'</span><span class=\"token punctuation\">,</span> body<span class=\"token punctuation\">)</span> <span class=\"token comment\">/*渲染孩子节点*/</span><span class=\"token punctuation\">}</span><span class=\"token plain-text\">\n        </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n      </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span>\n    <span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n  <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">}</span>\n\n<span class=\"token comment\">// 如果不支持 Decorators 语法也可以使用如下写法</span>\n<span class=\"token keyword\">export</span> <span class=\"token function\">Renderer</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>\n  <span class=\"token literal-property property\">type</span><span class=\"token operator\">:</span> <span class=\"token string\">'page'</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">(</span><span class=\"token keyword\">class</span> <span class=\"token class-name\">PageRenderer</span> <span class=\"token keyword\">extends</span> <span class=\"token class-name\">React<span class=\"token punctuation\">.</span>Component</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token comment\">// ...同上</span>\n  <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span>\n</code></pre>\n<p>Form 组件的示例代码</p>\n<pre><code class=\"language-jsx\">@<span class=\"token function\">Renderer</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>\n  <span class=\"token literal-property property\">type</span><span class=\"token operator\">:</span> <span class=\"token string\">'form'</span>\n  <span class=\"token comment\">// ... 其他信息隐藏了</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span>\n<span class=\"token keyword\">export</span> <span class=\"token keyword\">class</span> <span class=\"token class-name\">FormRenderer</span> <span class=\"token keyword\">extends</span> <span class=\"token class-name\">React<span class=\"token punctuation\">.</span>Component</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token comment\">// ... 其他信息隐藏了</span>\n  <span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token keyword\">const</span> <span class=\"token punctuation\">{</span>\n      title<span class=\"token punctuation\">,</span>\n      body<span class=\"token punctuation\">,</span>\n      render <span class=\"token comment\">// 用来渲染孩子节点，如果当前是叶子节点则可以忽略。</span>\n    <span class=\"token punctuation\">}</span> <span class=\"token operator\">=</span> <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>props<span class=\"token punctuation\">;</span>\n    <span class=\"token keyword\">return</span> <span class=\"token punctuation\">(</span>\n      <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>form</span> <span class=\"token attr-name\">className</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>form<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n        </span><span class=\"token punctuation\">{</span>body<span class=\"token punctuation\">.</span><span class=\"token function\">map</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">(</span><span class=\"token parameter\">control<span class=\"token punctuation\">,</span> index</span><span class=\"token punctuation\">)</span> <span class=\"token operator\">=></span> <span class=\"token punctuation\">(</span>\n          <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">className</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>form-item<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">key</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span>index<span class=\"token punctuation\">}</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n            </span><span class=\"token punctuation\">{</span><span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token template-string\"><span class=\"token template-punctuation string\">`</span><span class=\"token interpolation\"><span class=\"token interpolation-punctuation punctuation\">${</span>index<span class=\"token interpolation-punctuation punctuation\">}</span></span><span class=\"token string\">/control</span><span class=\"token template-punctuation string\">`</span></span><span class=\"token punctuation\">,</span> control<span class=\"token punctuation\">)</span><span class=\"token punctuation\">}</span><span class=\"token plain-text\">\n          </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span>\n        <span class=\"token punctuation\">)</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">}</span><span class=\"token plain-text\">\n      </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>form</span><span class=\"token punctuation\">></span></span>\n    <span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n  <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<p>Text 组件的示例代码</p>\n<pre><code class=\"language-jsx\">@<span class=\"token function\">Renderer</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>\n    <span class=\"token literal-property property\">type</span><span class=\"token operator\">:</span> <span class=\"token string\">'input-text'</span>\n    <span class=\"token comment\">// ... 其他信息隐藏了</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span>\n<span class=\"token keyword\">export</span> <span class=\"token keyword\">class</span> <span class=\"token class-name\">FormItemTextRenderer</span> <span class=\"token keyword\">extends</span> <span class=\"token class-name\">React<span class=\"token punctuation\">.</span>Component</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token comment\">// ... 其他信息隐藏了</span>\n    <span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n        <span class=\"token keyword\">const</span> <span class=\"token punctuation\">{</span>\n            label<span class=\"token punctuation\">,</span>\n            name<span class=\"token punctuation\">,</span>\n            onChange\n        <span class=\"token punctuation\">}</span> <span class=\"token operator\">=</span> <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>props<span class=\"token punctuation\">;</span>\n        <span class=\"token keyword\">return</span> <span class=\"token punctuation\">(</span>\n            <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">className</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>form-group<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n                </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>label</span><span class=\"token punctuation\">></span></span><span class=\"token punctuation\">{</span>label<span class=\"token punctuation\">}</span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>label</span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n                </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>input</span> <span class=\"token attr-name\">type</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>text<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">onChange</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span><span class=\"token punctuation\">(</span><span class=\"token parameter\">e</span><span class=\"token punctuation\">)</span> <span class=\"token operator\">=></span> <span class=\"token function\">onChange</span><span class=\"token punctuation\">(</span>e<span class=\"token punctuation\">.</span>currentTarget<span class=\"token punctuation\">.</span>value<span class=\"token punctuation\">)</span><span class=\"token punctuation\">}</span></span> <span class=\"token punctuation\">/></span></span><span class=\"token plain-text\">\n            </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n        );\n    }\n}</span>\n</code></pre>\n<p>那么渲染过程就是根据节点 type 信息，跟组件池中的找到对应的组件实现，如果命中，则把当前节点转给对应组件渲染，节点中其他属性将作为目标组件的 props。需要注意的是，如果是容器组件，比如以上例子中的 <code>page</code> 组件，从 props 中拿到的 <code>body</code> 是一个子节点，由于节点类型是不固定，由使用者决定，所以不能直接完成渲染，所以交给属性中下发的 <code>render</code> 方法去完成渲染，<code>{render(&#39;body&#39;, body)}</code>，他的工作就是拿子节点的 type 信息去组件池里面找到对应的渲染器，然后交给对应组件去完成渲染。</p>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "工作原理",
          "fragment": "%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86",
          "fullPath": "#%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});