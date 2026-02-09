import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TradeLicenceStateService {
  private tradeLicenceID: number | null = null;

  setTradeLicenceID(id: number): void {
    if (!this.tradeLicenceID) {
      this.tradeLicenceID = id;
    }
  }

  getTradeLicenceID(): number | null {
    return this.tradeLicenceID;
  }

  clear(): void {
    this.tradeLicenceID = null;
  }
}
