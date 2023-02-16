import { HttpEventType } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, DoCheck, OnInit, OnDestroy, QueryList, SkipSelf, ViewChild, ViewChildren, ɵisObservable } from '@angular/core';
import { catchError, map, Observable, of, Subject, Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { ConfigService } from '../services/config.service';
import { Room, RoomList } from './rooms'
import { RoomsService } from './services/rooms.service';

@Component({
  selector: 'hinv-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, DoCheck, AfterViewInit, AfterViewChecked, OnDestroy {
  constructor(@SkipSelf() private roomsService: RoomsService,
  private configService: ConfigService) { }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // @ViewChild(HeaderComponent, {static: true}) headerComponent?: HeaderComponent;
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  @ViewChildren(HeaderComponent) headerChildrenComponent!: QueryList<HeaderComponent>;

  roomList: RoomList[] = [];

  stream = new Observable(observer => {
    observer.next('user1');
    observer.next('user2');
    observer.next('user3');
    observer.complete();
    // observer.error('error');
  });

  totalBytes = 0;

  subscription!: Subscription;
  
  error$ = new Subject<string>;
  getError$ = this.error$.asObservable();

  rooms$ = this.roomsService.getRooms$.pipe(
    catchError(err => {
      // console.log(err);
      this.error$.next(err.message);
      return of([])
    })
  );
  
  roomsCount$ = this.roomsService.getRooms$.pipe(
    map(rooms => rooms.length)
  )

  ngOnInit(): void {
    this.roomsService.getPhotos().subscribe(event => {
      switch (event.type) {
        case HttpEventType.Sent: {
          console.log('Request has been made!');
          break;
        }
        case HttpEventType.ResponseHeader: {
          console.log('Request Success!');
          break;
        }
        case HttpEventType.DownloadProgress: {
          this.totalBytes += event.loaded;
          break;
        }
        case HttpEventType.Response: {
          console.log(event.body);
          break;
        }
      }
    });

    // console.log(this.headerComponent);
    // this.roomList = this.roomsService.getRoom();
    //
    // this.stream.subscribe(data => {console.log(data)});

    this.stream.subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('complete'),
      error: (err) => console.log(err)
    });

    // this.roomsService.getRoom().subscribe(rooms => {
    // this.roomList = rooms;
    // })
    // this.roomsService.getRooms$.subscribe(rooms => {
    // this.roomList = rooms;
    // });

    // this.subscription = this.roomsService.getRooms$.subscribe(rooms => {
    // this.roomList = rooms;
    // });
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // console.log(this.headerComponent);
    this.headerComponent.title = 'Tuong Nhu Hotel';
    this.headerChildrenComponent.last.title = 'Last Title';
    this.headerChildrenComponent.first.title = 'First Title';
  }

  ngDoCheck(): void {
    console.log('check changes on entire application');
  }
  hotelName = 'Tuong Nhu Hotel';

  numberOfRooms = 10;

  hideRooms = true;

  selectedRoom?: RoomList;

  rooms: Room = {
    totalRooms: 20,
    availableRooms: 10,
    bookedRooms: 5
  }

  title: string = 'Tuong Nhu Room List';


  toggle() {
    this.hideRooms = !this.hideRooms;
    this.title = this.title.toUpperCase() === this.title ? this.title.toLowerCase() : this.title.toUpperCase();
  }

  selectRoom(room: RoomList) {
    this.selectedRoom = room;
  }

  addRoom() {
    const room: RoomList = {
      // roomNumber: '4',
      roomType: 'Deluxe Suite',
      amenities: 'Air Conditioner, Free Wifi, Tv, Bathroom, Kitchen',
      price: 11500,
      photos: 'https://unsplash.com/fr/photos/T5pL6ciEn-I',
      checkinTime: new Date('11-Nov-2021'),
      checkoutTime: new Date('12-Nov-2021'),
      rating: 7.6
    }
    //changeDetection default
    // this.roomList.push(room);

    //changeDetection onPush - immutability
    // this.roomList = [...this.roomList, room];

    this.roomsService.addRoom(room).subscribe(data => {
      this.roomList = data;
    });
  }

  editRoom() {
    const room: RoomList = {
      roomNumber: '3',
      roomType: 'Deluxe Suite',
      amenities: 'Air Conditioner, Free Wifi, Tv, Bathroom, Kitchen',
      price: 11500,
      photos: 'https://unsplash.com/fr/photos/T5pL6ciEn-I',
      checkinTime: new Date('11-Nov-2021'),
      checkoutTime: new Date('12-Nov-2021'),
      rating: 7.6
    }

    this.roomsService.editRoom(room).subscribe(data => {
      this.roomList = data;
    });
  }

  deleteRoom() {
    this.roomsService.deleteRoom('3').subscribe(data => {
      this.roomList = data;
    });
  }

}
