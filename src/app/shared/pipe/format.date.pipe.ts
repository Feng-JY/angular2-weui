/**
 * @license
 * Copyright 厦门乾元盛世科技有限公司 All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */


import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NumberWrapper } from '@angular/common/src/facade/lang';
import { DateFormatter } from '@angular/common/src/pipes/intl';
import { InvalidPipeArgumentError } from '@angular/common/src/pipes/invalid_pipe_argument_error';

import { StringUtils } from '../utils/string.utils';


/**
 * @ngModule CommonModule
 * @whatItDoes Formats a date according to locale rules.
 * @howToUse `date_expression | formatDate[:to-format][:from-format]`
 * @author fbchen
 * @version 1.0 2016-12-06
 * @description
 *
 *
 * ### Examples
 *
 * Assuming `dateStr` is "2016-09-12 23:15:00" (year: 2016, month: 9, day: 12, hour: 23, minute: 15, second: 0)
 * in the _local_ time and locale is 'zh-CN':
 *
 * ```
 *     {{ dateStr | formatDate: 'y年M月d日' : 'y-MM-dd HH:mm:ss' }}  // output is '2016年9月12日'
 *     {{ dateStr | formatDate: 'y年M月d日' }}                       // output is '2016年9月12日'
 * ```
 *
 */
@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {

    constructor( @Inject(LOCALE_ID) private _locale: string) {

    }

    transform(value: any, toPattern = 'y-MM-dd', fromPattern = 'y-MM-dd HH:mm:ss'): string {
        let date: Date;

        if (StringUtils.isBlank(value)) {
            return null;
        }

        if (typeof value === 'string') {
            value = value.trim();
        }

        if (typeof value['getTime'] !== undefined) {
            date = value;
        } else if (NumberWrapper.isNumeric(value)) {
            date = new Date(parseFloat(value));
        } else if (typeof value === 'string') {
            /**
             * For ISO Strings without time the day, month and year must be extracted from the ISO String
             * before Date creation to avoid time offset and errors in the new Date.
             * If we only replace '-' with ',' in the ISO String ("2015,01,01"), and try to create a new
             * date, some browsers (e.g. IE 9) will throw an invalid Date error
             * If we leave the '-' ("2015-01-01") and try to create a new Date("2015-01-01") the timeoffset
             * is applied
             * Note: ISO months are 0 for January, 1 for February, ...
             */
            try {
                date = StringUtils.parseDate(value, fromPattern);
            } catch (e) {
                console.error(e);
            }
        }

        if (date == null || date == undefined) {
            date = new Date(value);
        }

        if (typeof date['getTime'] == undefined) {
            throw new InvalidPipeArgumentError(FormatDatePipe, value);
        }

        return DateFormatter.format(date, this._locale, DatePipe['_ALIASES'][toPattern] || toPattern);
    }


}
