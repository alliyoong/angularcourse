import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { exhaustMap, mergeMap, switchMap } from 'rxjs';
import {ConfigService} from '../services/config.service';
import { BookingService } from './booking.service';
import { CustomValidator } from './validators/custom-validator';

@Component({selector: 'hinv-booking', templateUrl: './booking.component.html', styleUrls: ['./booking.component.scss']})
export class BookingComponent implements OnInit {
    bookingForm !: FormGroup;

    constructor(
        private configService : ConfigService, 
        private fb : FormBuilder, 
        private bookingService: BookingService,
        private route: ActivatedRoute
        ) {}
    get guests() {
        return this.bookingForm.get('guests')as FormArray;
    }


    ngOnInit(): void {
        const roomId = this.route.snapshot.paramMap.get('roomid');
        this.bookingForm = this.fb.group({
            // roomId: [''],
            roomId: new FormControl({value: roomId, disabled: true},{validators: [Validators.required]}),
            guestEmail: ['',{updateOn: 'blur', validators: [Validators.email, Validators.required]}],
            checkinDate: [''],
            checkoutDate: [''],
            bookingStatus: [''],
            bookingAmount: [''],
            bookingDate: [''],
            mobileNumber: ['', {updateOn: 'blur'}],
            guestName: ['', [Validators.required, Validators.minLength(5), CustomValidator.ValidateName, CustomValidator.ValidateSpecialChar('*')]],
            address: this.fb.group(
                {
                    addressLine1: ['', {validators: [Validators.required]}],
                    addressLine2: [''],
                    city: ['',{validators: [Validators.required]}],
                    state: ['',{validators: [Validators.required]}],
                    country: [''],
                    zipCode: ['']
                }
            ),
            guests: this.fb.array(
                [this.fb.group(
                        {guestName: ['',{validators: [Validators.required]}], age: new FormControl('')}
                    )]
            ),
            tnc: new FormControl(false,{validators: [Validators.requiredTrue]})
        }, 
        {updateOn: 'blur', validators: [CustomValidator.ValidateDate]}
        )
        
        this.getBookingData();
        
        // this.bookingForm.valueChanges.subscribe(data => {
            // this.bookingService.bookRoom(data).subscribe(data => {})
        // });
        
        this.bookingForm.valueChanges.pipe(
            // mergeMap(data => this.bookingService.bookRoom(data))  //ko quan tam den thu tu data cua stream
            // switchMap(data => this.bookingService.bookRoom(data))    //chi quan tam den data moi nhat trong stream
            exhaustMap( data => this.bookingService.bookRoom(data))   //quan tam den thu tu, request cu phai xong truoc request moi
        ).subscribe(data => console.log(data));
    }

    addBooking() {
        console.log(this.bookingForm.value); // cannot get value of disabled field

        // this.bookingService.bookRoom(this.bookingForm.getRawValue()).subscribe(data => {
            // console.log(data);
        // });
        //
        // this.bookingForm.reset({
            // roomId: '2',
            // guestEmail: '',
            // checkinDate: '',
            // checkoutDate: '',
            // bookingStatus: '',
            // bookingAmount: '',
            // bookingDate: '',
            // mobileNumber: '',
            // guestName: '',
            // address: {
                // addressLine1: '',
                // addressLine2: '',
                // city: '',
                // state: '',
                // country: '',
                // zipCode: ''
            // },
            // guests: [],
            // tnc: false
        // });
    }
    
    getBookingData(){
        this.bookingForm.patchValue({
            guestEmail: 'test@gmail.com',
            checkinDate: new Date('10-Feb-2022'),
            checkoutDate: '',
            bookingStatus: '',
            bookingAmount: '',
            bookingDate: '',
            mobileNumber: '',
            guestName: '',
            address: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                country: '',
                zipCode: ''
            },
            guests: [],
            tnc: false
        });
    }

    addGuest() {
        this.guests.push(this.fb.group({guestName: ['',{validators: [Validators.required]}], age: new FormControl('')}));
    }
    
    addPassport(){
        this.bookingForm.addControl('passport', new FormControl(''));
    }

    deletePassport() {
        if(this.bookingForm.get('passport')) {
            this.bookingForm.removeControl('passport');
        }
    }

    removeGuest(i: number) {
        this.guests.removeAt(i);
    }
}
