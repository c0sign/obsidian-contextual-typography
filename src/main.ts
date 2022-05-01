import { App, TFile, MarkdownPostProcessorContext, Plugin, MarkdownView, getAllTags } from "obsidian";


function removeTagClasses(el){
    el.removeClasses([...el.classList].filter(t => t.startsWith('tag-')));
}

function addTagClasses(app, el, file: TFile){
    const cache = app.metadataCache.getFileCache(file);
    const tags = getAllTags(cache);
    tags.map(t => t.toLowerCase()).forEach((t) => {
      const tag = t.replace('#', '');
      el.addClass(`tag-${tag}`);
    });
}

function makeUpdateTags(app: App){
  function updateTags(file: TFile){
    let viewContent = app.workspace.activeLeaf.containerEl
                        .getElementsByClassName("markdown-source-view")[0];

    removeTagClasses(viewContent);
    addTagClasses(app, viewContent, file);
  }
  return updateTags;
}

export default class ContextualTypography extends Plugin {

  onload() {
    const updateTags = makeUpdateTags(this.app);
    this.registerEvent(this.app.metadataCache.on("changed", updateTags));
    this.registerEvent(this.app.workspace.on("file-open", updateTags));
    document.body.classList.add("contextual-typography");
  }

  unload() {
    document.body.classList.remove("contextual-typography");
    [...document.getElementsByClassName('markdown-source-view')].forEach(
      el => removeTagClasses(el)
    );
  }
}
