import type { Editor } from "grapesjs";
import { RequiredPluginOptions } from "..";
import {
  cmdClear,
  cmdDeviceDesktop,
  cmdDeviceMobile,
  cmdDeviceTablet,
  paged,
} from "./../consts";
import openImport from "./openImport";

import { CommandObject } from "grapesjs";
import { EditorModelParam } from "grapesjs";

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
      const pagePaths: any = {};
      const pagesList = document.createElement("li");

      const setTitle = document.createElement("button");
      setTitle.innerHTML = "Set Title";
      setTitle.setAttribute("id", "title_id");
      setTitle.style.marginTop = "10px";
      pagesList.appendChild(setTitle);

      setTitle.addEventListener("click", setTitlefunc);

      function setTitlefunc(selectedPage: any) {
        const wantedTitle = prompt("Enter title you want");
        selectedPage = pageManager.getSelected();
        const htmlCode = `<title>${wantedTitle}</title>`;
        if (selectedPage) {
          // selectedPage.components.add(htmlCode);
          const component = selectedPage.getMainComponent();
          component.append(htmlCode);
          // selectedPage.view.render();
        }
      }

      // const duplicate_button = document.createElement("button");
      // duplicate_button.innerHTML = "Duplicate Page";
      // duplicate_button.setAttribute("id", "pages_duplicate");
      // duplicate_button.style.marginTop = "10px";
      // pagesList.appendChild(duplicate_button);

      // duplicate_button.addEventListener("click", duplicatepage);

      // function duplicatepage() {
      //   const dupPage = pageManager.getSelected();
      //   if (dupPage) {
      //     const dupPageText = dupPage.getId();

      //     const duplicatedItem = document.createElement("li");
      //     if (typeof dupPageText !== "string") return;
      //     const onClick = () => pageManager.select(dupPageText);
      //     duplicatedItem.addEventListener("click", onClick);
      //     duplicatedItem.innerHTML = dupPageText;
      //     pagesList.appendChild(duplicatedItem);
      //     pageManager.select(dupPageText);
      //   } else {
      //   }
      // }

      //PATH

      const setPathButton = document.createElement("button");
      setPathButton.innerHTML = "Set Path";
      setPathButton.setAttribute("id", "pages_path");
      pagesList.appendChild(setPathButton);
      setPathButton.addEventListener("click", setPathFunc);

      function setPathFunc() {
        const selectedPage = pageManager.getSelected();
        if (selectedPage) {
          const pagePath = prompt(`Enter a path for ${selectedPage.id}:`);
          pagePaths[selectedPage.id] = pagePath;
        }
      }

      const nameButton = document.createElement("button");
      nameButton.innerHTML = "Rename Page";
      nameButton.setAttribute("id", "pages_name");
      pagesList.appendChild(nameButton);

      nameButton.addEventListener("click", changeName);

      function changeName() {
        const selectedPage = pageManager.getSelected();
        if (selectedPage) {
          const newName = prompt("Please edit the current name for this page");

          if (
            newName !== "" &&
            newName !== null &&
            typeof newName == "string"
          ) {
            selectedPage.setName(newName);
            console.log(selectedPage.getName());
            selectedPage.id = `${newName}`;
            console.log(selectedPage.getId());
          }
        }
      }

      const button = document.createElement("button");
      button.innerHTML = "Add Page";
      button.setAttribute("id", "pages_add");
      button.classList.add("pages_add");
      button.style.marginTop = "10px";
      pagesList.appendChild(button);

      button.addEventListener("click", pageadd);

      function pageadd() {
        const pageName = prompt("Please enter the desired name for the page");
        if (pageName !== "" && pageName !== null) {
          const newPage = pageManager.add({ id: `${pageName}` });
          if (newPage) {
            const newPageText = newPage.getId();
            const newPageItem = document.createElement("li");
            if (typeof newPageText !== "string") return;
            const onClick = () => pageManager.select(newPageText);
            newPageItem.addEventListener("click", onClick);
            newPageItem.innerHTML = newPageText;
            pagesList.appendChild(newPageItem);
            pageManager.select(newPageText);
            const pagePath = prompt(`Enter a path for ${pageName}:`);
            pagePaths[pageName] = pagePath;
          } else {
          }
        }
      }
      const pageManager = editor.Pages;

      //API call to get all the pages
      const pages = pageManager.getAll();

      pagesList.setAttribute("id", "pages-list");

      pages.forEach((page) => {
        const pageText = page.getId();
        if (typeof pageText !== "string") return;
        const pageItem = document.createElement("li");
        const onClick = () => pageManager.select(pageText);
        pageItem.addEventListener("click", onClick);
        pageItem.innerHTML = pageText;
        pagesList.appendChild(pageItem);
        pagesList.setAttribute("id", pageText);
        //now we need to add a button which can add pages her
      });

      const removeButton = document.createElement("button");
      removeButton.innerHTML = "Remove Page";
      removeButton.setAttribute("id", "pages_remove");
      removeButton.style.marginTop = "10px";
      pagesList.appendChild(removeButton);
      removeButton.addEventListener("click", removePagefunc);

      function removePagefunc() {
        const page = pageManager.getSelected();

        if (page) {
          const pageText = page.getId();
          if (typeof pageText !== "string") return;
          pageManager.remove(pageText);
          const listItemToRemove = document.getElementById(pageText);
          if (listItemToRemove && listItemToRemove.parentNode) {
            listItemToRemove.parentNode.removeChild(listItemToRemove);
          }
        }
      }

      //Get Home Page

      //API call to get all the pages
      //xxxxxxx ///xxxxxx

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
