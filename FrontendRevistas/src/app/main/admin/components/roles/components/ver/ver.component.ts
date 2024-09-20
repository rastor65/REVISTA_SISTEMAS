import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/dashboard/admin.service';
import { environment } from 'src/environments/environment';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { RolesService } from 'src/app/core/services/admin/roles.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  roles: any[] = [];
  selectedRole: any = {};
  isCreating: boolean = false;
  isEditing: boolean = false;
  dialogVisible: boolean = false;
  dialogType: string = ''; // 'create', 'edit', 'delete'
  dialogHeader: string = '';

  constructor(private rolesService: RolesService, public dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe(response => {
      this.roles = response;
    });
  }

  createRole(): void {
    this.showCreateDialog();
  }

  editRole(role: any): void {
    this.showEditDialog(role);
  }

  saveRole(): void {
    const roleData = {
      name: this.selectedRole.name,
      status: this.selectedRole.status // Asegúrate de incluir el campo status
    };
  
    if (this.dialogType === 'create') {
      this.rolesService.createRole(roleData).subscribe(() => {
        this.loadRoles();
        this.closeDialog();
      });
    } else if (this.dialogType === 'edit') {
      this.rolesService.updateRole(this.selectedRole.id, roleData).subscribe(() => {
        this.loadRoles();
        this.closeDialog();
      });
    }
  }
  

  cancelEdit(): void {
    this.closeDialog();
  }

  deleteRole(roleId: number): void {
    this.rolesService.deleteRole(roleId).subscribe(() => {
      this.loadRoles();
      this.closeDialog();
    });
  }

  showCreateDialog(): void {
    this.dialogType = 'create';
    this.dialogHeader = 'Crear Rol';
    this.selectedRole = { name: '' }; // Inicializa para crear
    this.dialogVisible = true;
  }

  showEditDialog(role: any): void {
    this.dialogType = 'edit';
    this.dialogHeader = 'Editar Rol';
    this.selectedRole = { ...role };
    this.dialogVisible = true;
  }

  showDeleteDialog(role: any): void {
    this.dialogType = 'delete';
    this.dialogHeader = 'Eliminar Rol';
    this.selectedRole = { ...role };
    this.dialogVisible = true;
  }

  cancelDelete(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.dialogType = '';
    this.dialogHeader = '';
    this.selectedRole = {};
  }
}