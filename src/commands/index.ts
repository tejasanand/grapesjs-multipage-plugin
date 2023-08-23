import type { Editor } from "grapesjs";
import { RequiredPluginOptions } from "..";
import {
  cmdClear,
  cmdDeviceDesktop,
  cmdDeviceMobile,
  cmdDeviceTablet,
  pageShit,
} from "./../consts";
import openImport from "./openImport";

import { CommandObject } from "grapesjs";

export default (editor: Editor, config: RequiredPluginOptions) => {
  const { Commands } = editor;
  const txtConfirm = config.textCleanCanvas;

  openImport(editor, config);

  Commands.add(cmdDeviceDesktop, {
    run: (ed) => ed.setDevice("Desktop"),
    stop: () => {},
  });
  Commands.add(cmdDeviceTablet, {
    run: (ed) => ed.setDevice("Tablet"),
    stop: () => {},
  });
  Commands.add(cmdDeviceMobile, {
    run: (ed) => ed.setDevice("Mobile portrait"),
    stop: () => {},
  });
  Commands.add(
    cmdClear,
    (e: Editor) => confirm(txtConfirm) && e.runCommand("core:canvas-clear")
  );

  const commands = editor.Commands;

  commands.add("open-pd", {
    run(editor) {
      const pageManager = editor.Pages;
      const pages = pageManager.getAll();
      const pagesList = document.createElement("li");
      pagesList.setAttribute("id", "pages-list");

      pages.forEach((page) => {
        const pageText = page.getId();
        if (typeof pageText !== "string") return;
        const pageItem = document.createElement("li");
        const onClick = () => pageManager.select(pageText);
        pageItem.addEventListener("click", onClick);
        pageItem.innerHTML = pageText;
        pagesList.appendChild(pageItem);
        //now we need to add a button which can add pages her
      });

      const button = document.createElement("button");
      button.innerHTML = "Add Page";
      button.setAttribute("id", "pages_add");
      button.classList.add("pages_add");
      button.style.marginTop = "10px";
      pagesList.appendChild(button);

      const lm = editor.LayerManager;
      const pn = editor.Panels;
      const lmConfig = lm.getConfig();

      if (lmConfig.appendTo) return;

      if (!this.layers) {
        const id = "views-container";
        const layers = pagesList;
        // @ts-ignore
        const panels = pn.getPanel(id) || pn.addPanel({ id });

        panels.set("appendContent", layers).trigger("change:appendContent");
        this.layers = layers;
      }

      if (this.layers) {
        this.layers.style.display = "block";
      }
    },

    stop() {
      const { layers } = this;
      layers && (layers.style.display = "none");
    },
  } as CommandObject<{}, { [k: string]: any }>);
};
