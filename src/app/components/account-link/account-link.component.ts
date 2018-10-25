import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { GetActiveCustomer } from '../../../../codegen/generated-types';
import { notNullOrUndefined } from '../../common/utils/not-null-or-undefined';
import { DataService } from '../../providers/data.service';
import { StateService } from '../../providers/state.service';

import { GET_ACTIVE_CUSTOMER } from './account-link.graphql';

@Component({
    selector: 'vsf-account-link',
    templateUrl: './account-link.component.html',
    styleUrls: ['./account-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountLinkComponent implements OnInit {

    activeCustomer$: Observable<GetActiveCustomer.ActiveCustomer>;
    constructor(private dataService: DataService,
                private stateService: StateService) {}

    ngOnInit() {
        const getActiveCustomer$ = this.dataService.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER);

        getActiveCustomer$.pipe(take(1)).subscribe(data => {
            if (data.activeCustomer) {
                this.stateService.setState('signedIn', true);
            }
        });

        this.activeCustomer$ = this.stateService.select(state => state.signedIn).pipe(
            switchMap(() => getActiveCustomer$),
            map(data => data && data.activeCustomer),
            filter(notNullOrUndefined),
        );
    }

}