/**
 * @license
 * Copyright 厦门乾元盛世科技有限公司 All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

import { Component, Input, Renderer, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


const WEUI_FORM_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WeUISlider),
    multi: true
};

@Component({
    selector: 'weui-slider',
    templateUrl: 'weui.slider.html',
    providers: [WEUI_FORM_CONTROL_VALUE_ACCESSOR]
})
export class WeUISlider extends DefaultValueAccessor {

    /**
     * 颜色，取值：default、primary、warn等。默认为default。<br>
     * 自定义的颜色名称与色值，可以定义在 工程根目录/src/theme/variables.scss 文件中的 $colors 对象。
     */
    @Input() color = 'default';

    /**
     * 显示值（在最后）
     */
    @Input() showValue: boolean = true;

    /**
     * 禁用样式
     */
    @Input() disabled: boolean = false;

    /**
     * 最小值
     */
    @Input() min: number = 0;

    /**
     * 最大值
     */
    @Input() max: number = 100;

    // 内部组件
    @ViewChild('sliderInner') sliderInner: ElementRef;

    /**
     * 取值
     */
    private value: number = 0;

    /**
     * 滑动比例（取值：0-100）
     */
    public percent: number = 0;

    private totalLen: number; // 滑条总长度
    private start: number; // 起始位置
    private startX: number; // 鼠标起始点

    constructor(private renderer: Renderer, private elementRef: ElementRef) {
        super(renderer, elementRef);
    }

    onTouchStart(event: TouchEvent): void {
        if (this.disabled) {
            return;
        }

        this.totalLen = this.sliderInner.nativeElement.clientWidth;
        this.start = this.percent * this.totalLen / 100;
        this.startX = event.targetTouches[0].clientX;
        this.onTouched();
    }

    onTouchMove(event: TouchEvent): void {
        if (this.disabled) {
            return;
        }

        const dist: number = event.targetTouches[0].clientX - this.startX;
        let end: number = this.start + dist;
        end = end < 0 ? 0 : end > this.totalLen ? this.totalLen : end;
        this.percent = end * 100 / this.totalLen;
        this.value = Math.round(this.min + (this.max - this.min) * this.percent / 100);

        event.preventDefault();
        this.onChange(this.value);
    }

    /**
     * Write a new value to the element.
     *
     * @internal (From ControlValueAccessor interface)
     */
    writeValue(value: number): void {
        if (value !== undefined && value !== null) {
            value = Math.min(Math.max(value, this.min), this.max);
            this.value = value;
            this.percent = (value + this.min) * 100 / this.max;
        }
    }

    /**
     * @internal (From ControlValueAccessor interface)
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}
