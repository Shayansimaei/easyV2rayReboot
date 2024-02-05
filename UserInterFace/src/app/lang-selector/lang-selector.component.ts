import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';
@Component({
  selector: 'lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.scss'],
})
export class LangSelectorComponent  implements OnInit {

  constructor(public langService:TranslateService) { }
  ngOnInit() {
    this.modifyLang()
    this.langService.tolgee.on("update",()=>this.modifyLang());

  }
  modifyLang():void{
    const htmlTag = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = this.langService.language =="fa" ? "rtl" : "ltr";

  }

}
