import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Inject,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements AfterViewInit {
  @Input() component: any;
  @Input() componentInputs!: Object;
  @Input() dialogName: string = '';

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(ModalController) private modalController: ModalController
  ) {}
  ngAfterViewInit(): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      this.component
    );

    let componentRef = this.container.createComponent(factory);
    if (this.componentInputs)
      Object.keys(this.componentInputs).forEach((key) => {
        componentRef.setInput(key, (this.componentInputs as any)[key]);
      });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
