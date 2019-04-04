import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpResponse, HttpErrorResponse, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class ServiceOptions {
    public basePath = '';
    public loginUrl: string;
}

@Injectable()
export abstract class ServiceBase {
    private dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*/;

    constructor(public http: HttpClient, public options: ServiceOptions) {
        this.reviver = this.reviver.bind(this);
    }

    protected request<T>(path: string, method: string, urlParams?: any, body?: any): Promise<T> {
        let url = path;
        let params = new HttpParams();

        if (urlParams !== undefined) {
            Object.getOwnPropertyNames(urlParams).forEach((paramName) => {
                if (url.indexOf(`{${paramName}}`) !== -1) {
                    url = url.replace(`{${paramName}}`, urlParams[paramName]);
                } else {
                    params = this.addSearchParam(params, paramName, urlParams[paramName]);
                }
            });
        }

        const request = new HttpRequest<any>(method, this.options.basePath + url, body, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: params,
            responseType: 'text'
        });

        const promise = new Promise<any>((resolve, reject) => {
            this.http.request(request).subscribe((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    resolve(this.extractBody(event));
                }
            }, (error: HttpErrorResponse) => {
                reject(this.extractError(error));
            })
        });

        return promise;
    }

    private extractBody(response: HttpResponse<any>): any {
        let body = response.body;

        if (typeof body === 'string') {
            if (this.isJsonResponse(response)) {
                try {
                    body = this.parseJson(body);
                }
                catch (e) {
                }
            }
        }

        if (body) {
            return body;
        }

        return undefined;
    }

    private extractError(response: HttpErrorResponse): Error {
        if (response.error instanceof Error) {
            return response.error;
        } else {
            if (this.isJsonResponse(response)) {
                let body = response.error;

                if (typeof body === 'string') {
                    body = this.parseJson(body);
                }

                const error = new Error(body.message);

                if ('validationErrors' in body) {
                    error['validationErrors'] = body.validationErrors;
                }

                return error;
            } else {
                return new Error(response.error);
            }
        }
    }

    private isJsonResponse(response: HttpResponse<any> | HttpErrorResponse): boolean {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.indexOf('application/json') !== -1) {
            return true;
        }

        return false;
    }

    private parseJson(text: string): any {
        return JSON.parse(text, this.reviver);
    }

    private reviver(key: any, value: any) {
        if (typeof value === 'string' && this.dateFormat.test(value)) {
            return new Date(value);
        }

        return value;
    }

    private addSearchParam(params: HttpParams, name: string, value: any): HttpParams {
        if (value instanceof Array) {
            value.forEach((v, i) => {
                params = this.addSearchParam(params, `${name}[${i}]`, v);
            });
        } else {
            if (value instanceof Date) {
                params = params.append(name, value.toUTCString());
            } else {
                if (value instanceof Object) {
                    Object.getOwnPropertyNames(value).forEach((propertyName) => {
                        params = this.addSearchParam(params, `${name}.${propertyName}`, value[propertyName]);
                    });
                } else {
                    if (value) {
                        params = params.append(name, value);
                    }
                }
            }
        }

        return params;
    }
}


@Injectable()
export class PartnerService extends ServiceBase {

    // tslint:disable-next-line:max-line-length
    public setPartnerIsPublished(cmd: SetPartnerIsPublishedCommand): Promise<void> {
        return this.request<void>('/BdManagerPartner/SetPartnerIsPublished', 'put', {}, cmd);
    }

    // tslint:disable-next-line:max-line-length
    public setPartnerContractConcluded(cmd: SetPartnerContractConcludedCommand): Promise<void> {
        return this.request<void>('/BdManagerPartner/SetPartnerContractConcluded', 'put', {}, cmd);
    }

    // tslint:disable-next-line:max-line-length
    public setPartnerNotes(cmd: SetPartnerNotesCommand): Promise<void> {
        return this.request<void>('/BdManagerPartner/SetPartnerNotes', 'put', {}, cmd);
    }

    // tslint:disable-next-line:max-line-length
    public createPartner(command: CreatePartnerCommand2): Promise<CreatePartnerResult> {
        return this.request<CreatePartnerResult>('/BdManagerPartner/CreatePartner', 'post', {}, command);
    }

    // tslint:disable-next-line:max-line-length
    public getPartnerList(): Promise<BdmPartnerInfo[]> {
        return this.request<BdmPartnerInfo[]>('/BdManagerPartner/GetPartnerList', 'get');
    }

}

      
export interface CreatePartnerCommand2 extends IYtValidatableObject {
    name?: string;
    email?: string;
    phone?: string;
    partnerContactFistName?: string;
    partnerContactSecondName?: string;
    partnerContactLastName?: string;
    partnerContactEmail?: string;
    partnerContactPhone?: string;
    role: PartnerRole;
}
