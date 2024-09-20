import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RecursosService } from 'src/app/core/services/admin/recursos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  resources: any[] = [];
  selectedResource: any = {};

  dialogVisible = false;
  dialogType = 'create';
  dialogHeader: string = '';

  constructor(private RecursosService: RecursosService, private dialogService: DialogService, 
    private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.loadResources();
    this.primengConfig.ripple = true; 
  }

  loadResources(): void {
    this.RecursosService.getResources().subscribe(data => {
      this.resources = data;
    });
  }

  showCreateDialog(): void {
    this.dialogType = 'create';
    this.selectedResource = {};
    this.dialogVisible = true;
  }

  showEditDialog(resource: any): void {
    this.dialogType = 'edit';
    this.selectedResource = { ...resource };
    this.dialogVisible = true;
  }
  
  showDeleteDialog(resource: any): void {
    this.dialogType = 'delete';
    this.selectedResource = { ...resource };
    this.dialogVisible = true;
  }

  saveResource(): void {
    if (this.dialogType === 'create') {
      this.RecursosService.createResource(this.selectedResource).subscribe(() => {
        this.dialogVisible = false;
        this.loadResources();
      });
    } else if (this.dialogType === 'edit') {
      this.RecursosService.updateResource(this.selectedResource.id, this.selectedResource).subscribe(() => {
        this.dialogVisible = false;
        this.loadResources();
      });
    }
  }

  cancelEdit(): void {
    this.dialogVisible = false;
  }

  deleteResource(id: number): void {
    this.RecursosService.deleteResource(id).subscribe(() => {
      this.dialogVisible = false;
      this.loadResources();
    });
  }

  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.resources.filter((resource) => resource[column].includes(filterValue));
  }

}