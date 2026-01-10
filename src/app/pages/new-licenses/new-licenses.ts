import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

/* =========================
   FIX LEAFLET ICON ISSUE
========================= */
interface TradeGridItem {
  major: string;
  minor: string;
  sub: string;
  rate: number;
}

@Component({
  selector: 'app-new-licenses',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-licenses.html',
  styleUrl: './new-licenses.css',
})
export class NewLicenses {
  //Stepper Logic
  currentStep = 0; // 0 = Declaration
  agree = false;

  //For map
  private L: any;
  map: any;
  marker: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  startApplication() {
    this.currentStep = 1;
  }

  nextStep() {
    if (this.currentStep < 7) {
      this.currentStep++;

      // Map init only when location step loads
      if (this.currentStep === 4) {
        setTimeout(() => {
          this.initMap();
          this.map.invalidateSize();
        }, 300);
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /* =========================
     APPLICANT
  ========================= */
  representations = [
    'Proprietor',
    'Partner',
    'Director',
    'Authorized Signatory'
  ];

  /* =========================
     TRADE MASTER (SAMPLE)
  ========================= */
  majorTrades = [
    {
      name: 'PART-1 (Trade Articles of food and Beverages)',
      minors: [
        {
          name: 'BREAD, BISCUITS, PASTRY, CONFECTIONARY AND SAVORIES',
          subs: [
            { name: 'Preparation without power', rate: 4000 },
            { name: 'Preparation with power', rate: 6000 }
          ]
        }
      ]
    }
  ];

  selectedMajor: any = null;
  selectedMinor: any = null;
  selectedSub: any = null;

  tradeGrid: TradeGridItem[] = [];

  /* =========================
     DATE / ZONE / FEE
  ========================= */
  applicationDate = new Date().toISOString().substring(0, 10);
  commencementDate = '';
  zone = '';

  licenseFee = 0;

  get totalAmount(): number {
    return this.tradeGrid.reduce((sum, t) => sum + t.rate, 0);
  }

  /* =========================
     TRADE GRID
  ========================= */
  addTrade() {
    if (!this.selectedMajor || !this.selectedMinor || !this.selectedSub) {
      alert('Please select Major, Minor and Sub Trade');
      return;
    }

    this.tradeGrid.push({
      major: this.selectedMajor.name,
      minor: this.selectedMinor.name,
      sub: this.selectedSub.name,
      rate: this.selectedSub.rate
    });

    this.calculateFee();
    this.selectedSub = null;
  }

  removeTrade(index: number) {
    this.tradeGrid.splice(index, 1);
    this.calculateFee();
  }

  /* =========================
     POWER / GENERATOR
  ========================= */
  powerHP = 0;
  generatorHP = 0;
  powerFee = 0;

  calculateFee() {
    this.powerFee = Math.max(this.powerHP, this.generatorHP) * 100;
    this.licenseFee = this.totalAmount + this.powerFee + 500; 
  }

  /* =========================
     DOCUMENT UPLOAD
  ========================= */
  documents: any = {};

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }


    this.documents[key] = file;
  }

  /* =========================
     OTP LOGIC (MOCK)
  ========================= */
  otp = '';
  otpSent = false;
  otpVerified = false;

  sendOtp() {
    this.otpSent = true;
    alert('OTP sent (Demo OTP: 1234)');
  }

  verifyOtp() {
    if (this.otp === '1234') {
      this.otpVerified = true;
      alert('OTP Verified');
    } else {
      alert('Invalid OTP');
    }
  }

  /* =========================
     MAP + LOCATION SEARCH
  ========================= */
  latitude: number | null = null;
  longitude: number | null = null;

  searchText = '';
  searchResults: any[] = [];

  //ngAfterViewInit(): void {}

  initMap() {
    if (!this.L || this.map) return;

    this.map = this.L.map('map', {
      center: [12.9716, 77.5946],
      zoom: 11
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const leaflet = await import('leaflet');
      this.L = leaflet;

      delete (this.L.Icon.Default.prototype as any)._getIconUrl;

      this.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'marker-icon-2x.png',
        iconUrl: 'marker-icon.png',
        shadowUrl: 'marker-shadow.png'
      });
    }
  }

  setMarker(lat: number, lng: number) {
    this.latitude = lat;
    this.longitude = lng;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = this.L.marker([lat, lng]).addTo(this.map);
    }
  }


  /* =========================
     LOCATION SEARCH (NOMINATIM)
  ========================= */
  searchLocation() {
    if (this.searchText.length < 3) {
      this.searchResults = [];
      return;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${this.searchText}&countrycodes=in&limit=5`
    )
      .then(res => res.json())
      .then(data => this.searchResults = data);
  }

  selectLocation(place: any) {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    this.searchText = place.display_name;
    this.searchResults = [];

    this.map.setView([lat, lon], 16);
    this.setMarker(lat, lon);
  }
}
