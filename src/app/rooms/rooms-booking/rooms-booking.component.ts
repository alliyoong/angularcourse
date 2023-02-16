import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'hinv-rooms-booking',
  templateUrl: './rooms-booking.component.html',
  styleUrls: ['./rooms-booking.component.scss']
})
export class RoomsBookingComponent implements OnInit{
  constructor(private router: ActivatedRoute){}
  
  id: number = 0;
  id$: Observable<any> = this.router.paramMap.pipe(
      map(params => params.get('roomid'))
    );

  ngOnInit(): void {
    // this.id = this.router.snapshot.params['roomid'];
    // this.router.params.subscribe(params => {console.log(params['roomid'])});
    //
    // this.router.paramMap.subscribe(params => {
      // params.get('roomid');
    // });
  }

}
