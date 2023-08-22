import type { Editor } from 'grapesjs';
import { RequiredPluginOptions } from '..';
import {
  cmdClear,
  cmdDeviceDesktop,
  cmdDeviceMobile,
  cmdDeviceTablet,
} from './../consts';
import openImport from './openImport';

export default (editor: Editor, config: RequiredPluginOptions) => {
  const { Commands } = editor;
  const txtConfirm = config.textCleanCanvas;

  openImport(editor, config);

  Commands.add(cmdDeviceDesktop, {
    run: ed => ed.setDevice('Desktop'),
    stop: () => { },
  });
  Commands.add(cmdDeviceTablet, {
    run: ed => ed.setDevice('Tablet'),
    stop: () => { },
  });
  Commands.add(cmdDeviceMobile, {
    run: ed => ed.setDevice('Mobile portrait'),
    stop: () => { },
  });
  Commands.add(cmdClear, (e: Editor) => confirm(txtConfirm) && e.runCommand('core:canvas-clear'));

  const commands = editor.Commands;

  // commands.add('open-pd', {
  //   run(editor) {
  //     const pageManager = editor.Pages;
  //     const panelManager = editor.Panels;

  //     const pages = pageManager.getAll(); //gets pages made
  //     const pagesList = document.getElementById("pages-list");


  //     pages.forEach((page) => {
  //       let pageText: any
  //       pageText = page.getId();
  //       const pageItem = document.createElement("li");
  //       const onClick = () => pageManager.select(pageText);
  //       pageItem.addEventListener("click", onClick);
  //       pageItem.innerHTML = pageText;
  //       pagesList.appendChild(pageItem);

  //       //now we need to add a button which can add pages her
  //     });

  //   },
  // });
}
