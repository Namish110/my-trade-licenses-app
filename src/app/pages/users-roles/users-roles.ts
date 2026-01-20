import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  UsersRolesService,
  LoginMaster,
  OfficeDetail,
  UserDesignation,
  LoginMasterRequest
} from './user-roles.service';

@Component({
  selector: 'app-users-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-roles.html',
  styleUrl: './users-roles.css',
})
export class UsersRoles implements OnInit {

  /* =====================================================
     GRID & PAGINATION
  ===================================================== */

  users: LoginMaster[] = [];

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  /* =====================================================
     SEARCH
  ===================================================== */

  searchText = '';
  isSearching = false;
searchTimer: any = null; // ✅ ADD THIS LINE
  /* =====================================================
     DROPDOWNS
  ===================================================== */

  officeList: OfficeDetail[] = [];
  designationList: UserDesignation[] = [];

  /* =====================================================
     FORM STATE
  ===================================================== */

  selectedUser: LoginMaster | null = null;
  isEditMode = false;

  constructor(private service: UsersRolesService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadOffices();
    this.loadDesignations();
  }

  /* =====================================================
     LOAD USERS (DEFAULT PAGINATED)
  ===================================================== */

  loadUsers(): void {
    this.isSearching = false;

    this.service.getUsers(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalRecords = res.totalRecords;
      },
      error: (err) => console.error('Load users failed', err)
    });
  }

  /* =====================================================
     SEARCH USERS
  ===================================================== */

  searchUsers(): void {
    if (!this.searchText.trim()) {
      this.clearSearch();
      return;
    }

    this.isSearching = true;
    this.pageNumber = 1;

    this.service.searchUsers(
      this.searchText,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalRecords = res.totalRecords;
      },
      error: (err) => console.error('Search failed', err)
    });
  }
onSearchChange(): void {
  clearTimeout(this.searchTimer);

  this.searchTimer = setTimeout(() => {
    if (!this.searchText.trim()) {
      this.clearSearch();
      return;
    }

    this.isSearching = true;
    this.pageNumber = 1;

    this.service.searchUsers(
      this.searchText,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalRecords = res.totalRecords;
      },
      error: (err) => console.error('Search failed', err)
    });

  }, 400); // 400ms debounce
}


  clearSearch(): void {
    this.searchText = '';
    
    this.pageNumber = 1;
    this.isSearching = false;
    this.loadUsers();
  }

  /* =====================================================
     ADD USER
  ===================================================== */

  addNewUser(): void {
    this.selectedUser = {
      loginID: 0,
      login: '',
      password: '',
      officeDetailsID: 0,
      userDesignationID: 0,
      sakalaDO_Code: '',     // API expects STRING
      MobileNo: '',
      isActive: 'Y'
    };

    this.isEditMode = false;
  }

  /* =====================================================
     EDIT USER
  ===================================================== */

  editUser(user: LoginMaster): void {
    this.selectedUser = {
      ...user,
      password: '' // never bind existing password
    };

    this.isEditMode = true;
  }

  /* =====================================================
     SAVE (INSERT / UPDATE)
  ===================================================== */

  saveUser(): void {
    if (!this.selectedUser) return;

    const payload: LoginMasterRequest = {
      login: this.selectedUser.login,
      password: this.selectedUser.password,
      officeDetailsID: this.selectedUser.officeDetailsID,
      userDesignationID: this.selectedUser.userDesignationID,
      sakalaDO_Code: this.selectedUser.sakalaDO_Code,
      mobileNo: this.selectedUser.MobileNo,
      updatedBy: 1   // logged-in user id
    };

    if (this.isEditMode) {
      // ✅ UPDATE
      this.service.updateUser(this.selectedUser.loginID, payload)
        .subscribe(() => {
          this.selectedUser = null;
          this.isEditMode = false;
          this.isSearching ? this.searchUsers() : this.loadUsers();
        });
    } else {
      // ✅ INSERT
      this.service.addUser(payload)
        .subscribe(() => {
          this.selectedUser = null;
          this.isSearching ? this.searchUsers() : this.loadUsers();
        });
    }
  }

  /* =====================================================
     DELETE USER
  ===================================================== */

  deleteUser(loginID: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.service.deleteUser(loginID, 1)
      .subscribe(() => {
        this.isSearching ? this.searchUsers() : this.loadUsers();
      });
  }

  /* =====================================================
     DROPDOWNS
  ===================================================== */

  loadOffices(): void {
    this.service.getOfficeDetails().subscribe({
      next: (res) => this.officeList = res,
      error: (err) => console.error('Office load failed', err)
    });
  }

  loadDesignations(): void {
    this.service.getUserDesignations().subscribe({
      next: (res) =>
        this.designationList = res.filter(d => d.isActive === 'Y'),
      error: (err) => console.error('Designation load failed', err)
    });
  }

  /* =====================================================
     DISPLAY HELPERS
  ===================================================== */

  getOfficeName(id: number): string {
    return this.officeList.find(o => o.officeID === id)?.officeName || '-';
  }

  getDesignationName(id: number): string {
    return this.designationList.find(d => d.userDesignationId === id)
      ?.userDesignationName || '-';
  }

  /* =====================================================
     PAGINATION
  ===================================================== */

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.isSearching ? this.searchUsers() : this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.isSearching ? this.searchUsers() : this.loadUsers();
    }
  }
}
