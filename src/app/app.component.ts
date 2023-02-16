import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {RoomsComponent} from './rooms/rooms.component';
import {LocalStorageToken} from './localstorage.token';
import {InitService} from './init.service';
import {ConfigService} from './services/config.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'hinv-root', templateUrl: './app.component.html',
    // template: `<h1>Hello World</h1>`,
    // styles: [`h1 {color: red;}`]
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
      @Inject(LocalStorageToken)private localStorage : Storage, 
      private initService : InitService, 
      private configService : ConfigService,
      private router: Router
      ) {
        console.log(initService.config);
    }

    title = 'hotelinventoryapp';
    // @ViewChild('user', {read: ViewContainerRef}) vcr!: ViewContainerRef;

    // ngAfterViewInit(): void {
    // const componentRef = this.vcr.createComponent(RoomsComponent);
    // componentRef.instance.numberOfRooms = 50;
    // }

    @ViewChild('name', {static: true})name !: ElementRef;

    ngOnInit(): void {
      // this.router.events.subscribe(event => {
        // console.log(event)
      // })
      this.router.events.pipe(
        filter(event => event instanceof NavigationStart)
      ).subscribe(event => {
        console.log('Navigation started');
      });
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(event => {
        console.log('Navigation ended');
      });

        this.name.nativeElement.innerHTML = 'Hotel California';
        this.localStorage.setItem('name', 'Thoa Hotel');
    }
}
