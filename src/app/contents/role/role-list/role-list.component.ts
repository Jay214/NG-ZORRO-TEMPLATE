import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "app/base/shared/model/page";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { SessionService } from "app/base/shared/session.service";
import { RoleFilter, Role, RoleService } from "app/contents/role/role.service";

@Component({
    moduleId: module.id,
    selector: 'cmall-role-list',
    templateUrl: 'role-list.component.html',
    styleUrls: ['role-list.component.css']
})
export class RoleListComponent implements OnInit {
    _pageIndex: number = 1;
    _pageSize: number = 10;
    filter: RoleFilter = new RoleFilter();
    page: Page<Role> = new Page<Role>();
    _loading: boolean = false;
    _deleting: boolean = false;

    constructor(
        private router: Router,
        private modalService: NzModalService,
        private messageService: NzMessageService,
        private roleService: RoleService,
        private sessionService: SessionService) {
    }

    ngOnInit(): void {
        this.search(true);
    }

    resetForm(): void {
        this.filter = new RoleFilter();
    }

    search(reset: boolean = false): void {
        if (reset)
            this._pageIndex = 1;

        this.filter.pageNumber = this._pageIndex - 1;
        this.filter.pageSize = this._pageSize;

        this._loading = true;
        this.roleService.getList(this.filter).subscribe(
            result => {
                this._loading = false;
                if (result.code != 0) {
                    this.messageService.error('加载角色列表失败：' + result.message);
                    return;
                }
                this.page = result.data;
            },
            error => {
                this._loading = false;
                this.messageService.error('执行失败：' + error);
            });
    }

    delete(role: Role): void {
        this._deleting = true;
        this.roleService.delete(role.name).subscribe(
            result => {
                this._deleting = false;
                if (result.code != 0) {
                    this.messageService.error('删除失败：' + result.message);
                    return;
                }
                this.messageService.success('删除成功');
                this._deleting = false;
                this.search();
            },
            (error) => {
                this._deleting = false;
                this.messageService.error('执行失败：' + error);
            });
    }
}