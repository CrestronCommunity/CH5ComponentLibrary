// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as _ from 'lodash';
import { Subscription } from "rxjs";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5SignalAttributeRegistry } from '../ch5-common/ch5-signal-attribute-registry';
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5KeypadButtonAttributes } from "./interfaces/i-ch5-keypad-btn-attributes";
import { TCh5KeypadButtonCreateDTO } from "./interfaces/t-ch5-keypad";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";

export class Ch5KeypadButton extends Ch5Common implements ICh5KeypadButtonAttributes {

	//#region 1. Variables

	//#region 1.1 readonly variables

	public static readonly ELEMENT_NAME = 'ch5-keypad-button';

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "key",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "labelMajor",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "labelMinor",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "iconClass",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnClick",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: false,
			name: "pressed",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		}
	];

	public readonly primaryCssClass = 'keypad-btn';
	public readonly pressedCssClassPostfix = '-pressed';

	//#endregion

	//#region 1.2 private / protected variables

	// protected setter getter specific vars
	protected _ch5Properties: Ch5Properties;

	// elements specific vars
	private params: TCh5KeypadButtonCreateDTO = {} as TCh5KeypadButtonCreateDTO;
	protected componentPrefix: string = 'ch5-keypad-button-';
	protected emptyBtnCssClass: string = 'empty-btn';
	protected labelMajorCssClass: string = 'label-major';
	protected labelMinorCssClass: string = 'label-minor';
	protected parentDivCssClass: string = 'keypad-row';

	// elements specific vars
	protected _elButton: HTMLElement = {} as HTMLElement;
	protected _elMajorSpan: HTMLElement = {} as HTMLElement;
	protected _elMinorSpan: HTMLElement = {} as HTMLElement;
	protected _elIcon: HTMLElement = {} as HTMLElement;

	// state specific vars
	// The interval id ( from setInterval ) for reenforcing the  onTouch signal
	// This id allow canceling the interval.
	protected _intervalIdForRepeatDigital: number | null = null;
	// this is last tap time used to determine if should send click pulse in focus event 
	protected _pressable: Ch5Pressable | null = null;
	// Time after that press will be triggered
	protected _pressTimeout: number = 0;
	// State of the button ( pressed or not )
	protected _buttonPressed: boolean = false;
	protected _buttonPressedInPressable: boolean = false;
	protected _pressableIsPressedSubscription: Subscription | null = null;
	// This variable ensures that the first time load on a project happens without debounce and buttons do not appear blank.
	protected isButtonInitiated: boolean = false;

	protected readonly TOUCH_TIMEOUT: number = 250;
	protected readonly DEBOUNCE_PRESS_TIME: number = 200;
	protected readonly PRESS_MOVE_THRESHOLD: number = 10;
	protected readonly STATE_CHANGE_TIMEOUTS: number = 500;

	protected readonly MAX_MODE_LENGTH: number = 99;
	protected readonly DEBOUNCE_BUTTON_DISPLAY: number = 25;

	//#endregion

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function") {
			window.customElements.define(Ch5KeypadButton.ELEMENT_NAME, Ch5KeypadButton);
		}
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5KeypadButton.ELEMENT_NAME, Ch5KeypadButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	//#endregion

	//#region 2. Setters and Getters

	public set labelMajor(value: string) {
		this._ch5Properties.set<string>("labelMajor", value, () => {
			this.labelMajorHandler();
		});
	}
	public get labelMajor() {
		return this._ch5Properties.get<string>("labelMajor");
	}

	public set labelMinor(value: string) {
		this._ch5Properties.set<string>("labelMinor", value, () => {
			this.labelMinorHandler();
		});
	}
	public get labelMinor(): string {
		return this._ch5Properties.get<string>("labelMinor")
	}

	public set iconClass(value: string) {
		this._ch5Properties.set<string>("iconClass", value, () => {
			this.iconHandler();
		});
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>("iconClass")
	}

	public set sendEventOnClick(value: string) {
		this._ch5Properties.set<string>("sendEventOnClick", value, () => {
			this.setAttribute('sendEventOnClick'.toLowerCase(), value);
		});
	}
	public get sendEventOnClick() {
		return this._ch5Properties.get<string>("sendEventOnClick");
	}

	public set key(value: string) {
		this._ch5Properties.set<string>("key", value, () => {
			this.keyHandler();
		});
	}
	public get key(): string {
		return this._ch5Properties.get<string>('key');
	}

	public set pressed(value: boolean) {
		this._ch5Properties.set<boolean>("pressed", value, () => {
			this.pressedHandler();
		});
	}
	public get pressed(): boolean {
		return this._ch5Properties.get<boolean>("pressed");
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor(params: TCh5KeypadButtonCreateDTO) {
		super();
		this.logger.start('constructor()', Ch5KeypadButton.ELEMENT_NAME);
		this.params = params;
		this._ch5Properties = new Ch5Properties(this, Ch5KeypadButton.COMPONENT_PROPERTIES);
		this.logger.stop();
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		this.logger.start("initAttributes", Ch5KeypadButton.ELEMENT_NAME);
		super.initAttributes();
		this.setAttribute('data-ch5-id', this.getCrId());
		ComponentHelper.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5KeypadChild); // WAI-ARIA Attributes
		const defaultMajors: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#', ''];
		const defaultMinors: string[] = ['+', '&nbsp;', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '', ''];
		const { major, minor, contractName, joinCountToAdd, iconClass, key, pressed, name, indexRef, contractKey, className, ...remainingParams } = this.params;
		this.labelMajor = major ? major : defaultMajors[indexRef];
		this.labelMinor = minor ? minor : defaultMinors[indexRef];
		this.iconClass = iconClass.join(' ');
		if (!this.iconClass && this.labelMajor === "*") {
			this.labelMinor = "";
			this._elMinorSpan.innerHTML = "";
		}
		this.key = key;
		this.pressed = pressed;

		const eventHandlerValue = (contractName.length > 0) ? contractName : joinCountToAdd;
		this.sendEventOnClick = eventHandlerValue;
		const remainingParamsKeys = Object.keys(remainingParams);
		const remainingParamsValues = Object.values(remainingParams);
		if (remainingParamsKeys.length) {
			for (let index = 0; index < remainingParamsKeys.length; index++) {
				if (!_.isNil(remainingParamsValues[index])) {
					ComponentHelper.setAttributeToElement(this, remainingParamsKeys[index].toLowerCase(), remainingParamsValues[index]);
				}
			}
		}
		this.logger.stop();
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback() - start', Ch5KeypadButton.ELEMENT_NAME);
		if (this.parentElement && !this.parentElement.classList.contains(this.parentDivCssClass)) {
			this.logger.stop();
			return;
		}

		ComponentHelper.clearComponentContent(this);
		this.updatePressedClass(this.primaryCssClass + this.pressedCssClassPostfix);

		this.setAttribute('data-ch5-id', this.getCrId());

		// init pressable before initAttributes because pressable subscribe to gestureable attribute
		if (!ComponentHelper.isNullOrUndefined(this._pressable) && !!this._pressable) {
			this._pressable.init();
			this._subscribeToPressableIsPressed();
		}

		// will have the flags ready for contract level content to be ready
		this.createElementsAndInitialize();

		this.initCommonMutationObserver(this);
		this.logger.stop();
	}

	/**
	 * Create HTML elements of the components including child elements
	 */
	protected createElementsAndInitialize() {
		this.initAttributes();
		if (!this._wasInstatiated) {
			this.createHtmlElements();
		}
		this.attachEventListeners();

		this._wasInstatiated = true;

		this.updateCssClasses();
	}

	/**
	 * Create all inner html elements required to complete keypad child-base button
	 */
	protected createHtmlElements(): void {
		this.logger.start('createHtmlElements', Ch5KeypadButton.ELEMENT_NAME);
		ComponentHelper.clearComponentContent(this);
		this.classList.add(this.primaryCssClass);
		this.classList.add(...(this.params.className.split(' ').filter(element => element))); // the filter removes empty spaces
		this.setAttribute('key', this.params.name);
		if (this.params.major.length > 0 ||
			this.params.minor.length > 0 ||
			this.params.iconClass.length > 0 || this.params.key.length > 0) {
			this._elButton = document.createElement('button');
			this._elMajorSpan = this.createLabelElementAndAppend(this.labelMajorCssClass, this.labelMajor);
			this._elMinorSpan = this.createLabelElementAndAppend(this.labelMinorCssClass, this.labelMinor);
			this._elButton.appendChild(this._elMajorSpan);
			this._elButton.appendChild(this._elMinorSpan);
			this.appendChild(this._elButton);
		} else {
			this.classList.add(this.emptyBtnCssClass);
		}

		if (this.params.pressed) {
			this.classList.add(this.primaryCssClass + this.pressedCssClassPostfix);
		}
		this.logger.stop();
	}

	protected attachEventListeners() {
		if (!_.isNil(this._pressable)) {
			this._pressable?.init();
			this._subscribeToPressableIsPressed();
		}
		// events binding
		this.bindEventListenersToThis();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.logger.start('disconnectedCallback() - start', Ch5KeypadButton.ELEMENT_NAME);

		if (this.parentElement && !this.parentElement.classList.contains(this.parentDivCssClass)) {
			this.logger.stop();
			return;
		}

		this.removeEventListeners();

		// destroy pressable
		if (null !== this._pressable) {
			this._pressable.destroy();
		}
		this.unsubscribeFromSignals();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();

		if (!_.isNil(this._pressable)) {
			this._unsubscribeFromPressableIsPressed();
		}

		this.logger.stop();
	}

	public removeEventListeners() {
		this.removeEventListener('click', this._onTapAction);
	}

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}

	static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5KeypadButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5KeypadButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5KeypadButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", Ch5KeypadButton.ELEMENT_NAME);
		if (oldValue !== newValue) {
			this.logger.log('ch5-keypad attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5KeypadButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		this.logger.stop();
	}

	//#endregion

	//#region 4. Other Methods

	protected createLabelElementAndAppend(className: string, value: string = '') {
		const element = document.createElement('span');
		element.classList.add(className);
		if (this.iconClass.length > 0 && className === this.labelMajorCssClass) {
			this._elIcon = document.createElement('span');
			this._elIcon.classList.add(...this.iconClass.split(' ').filter(ele => ele));
			element.appendChild(this._elIcon);
			element.classList.add('has-icon');
		} else {
			element.innerHTML = value;
		}
		return element;
	}

	protected labelMajorHandler() {
		if (this.labelMajor.length !== 0) {
			this._elMajorSpan.innerText = this.labelMajor
		} else {
			this.labelMajor = this.params.major;
		}
	}

	protected labelMinorHandler() {
		if (this.labelMinor.length !== 0) {
			this._elMinorSpan.innerHTML = this.labelMinor;
		} else {
			this.labelMinor = this.params.minor;
		}
	}

	protected keyHandler() {
		if (this.key.length === 0) {
			this.key = this.params.key;
		}
	}

	protected iconHandler() {
		const iconButton = this.getElementsByClassName("label-major has-icon");
		if (iconButton && iconButton[0]) {
			const spanBtn = iconButton[0].children[0];
			if (spanBtn) {
				spanBtn.setAttribute("class", this.iconClass);
			} else {
				this._elIcon.setAttribute("class", this.iconClass);
				this._elMajorSpan.innerHTML = '';
				this._elMajorSpan.appendChild(this._elIcon);
			}
		}
	}

	protected pressedHandler() {
		if (this.pressed === true) {
			this.updatePressedClass(this.primaryCssClass + this.pressedCssClassPostfix);
			this.classList.add(this.primaryCssClass + this.pressedCssClassPostfix);
		}
	}

	/**
	 * Called when pressed class will be available
	 * @param pressedClass is class name. it will add after press the ch5 keypad button
	 */
	protected updatePressedClass(pressedClass: string) {
		this._pressable = new Ch5Pressable(this, {
			cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
			cssPressedClass: pressedClass
		});
	}
	protected bindEventListenersToThis(): void {
		this.addEventListener('click', this._onTapAction);
	}

	protected sendValueForClickValue(value: boolean): void {
		if (!this.sendEventOnClick) { return; }

		const clickSignal: Ch5Signal<object | boolean> | null =
			Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this.sendEventOnClick);

		if (clickSignal && clickSignal.name) {
			clickSignal.publish(value);
		}
	}

	/**
	 * Sends the signal passed via sendEventOnClick or sendEventOnTouch
	 */
	protected _sendOnClickSignal(preventTrue: boolean = false, preventFalse: boolean = false): void {
		let sigClick: Ch5Signal<boolean> | null = null;
		if (this.sendEventOnClick) {
			sigClick = Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick);

			if (sigClick !== null) {
				if (!preventTrue) {
					this.sendValueForClickValue(true);
				}
				if (!preventFalse) {
					this.sendValueForClickValue(false);
				}
			}
		}
	}

	/**
	 * Press Handler
	 *
	 * @return {Promise}
	 */
	protected pressHandler(): Promise<boolean> {
		const pressHandler = () => {
			this.logger.log("Ch5Button._onPress()");
			this.pressed = true;
		}

		const pressPromise = new Promise<boolean>((resolve, reject) => {
			this._pressTimeout = window.setTimeout(() => {
				pressHandler();
				resolve(this.pressed);
			}, this.TOUCH_TIMEOUT);
		});

		return pressPromise;
	}

	protected _subscribeToPressableIsPressed() {
		if (this._pressableIsPressedSubscription === null && this._pressable !== null) {
			this._pressableIsPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				if (value !== this._buttonPressedInPressable) {
					this._buttonPressedInPressable = value;
				}
			});
		}
	}

	protected _unsubscribeFromPressableIsPressed() {
		if (this._pressableIsPressedSubscription !== null) {
			this._pressableIsPressedSubscription.unsubscribe();
			this._pressableIsPressedSubscription = null;
		}
	}

	public setJoinBasedEventHandler(startIndex: number, joinCountIndex: number) {
		const joinCountList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12];
		this.sendEventOnClick = (startIndex + joinCountList[joinCountIndex]).toString();
	}

	public setJoinBasedContractEventHandler(parentContract: string) {
		const keyIndex = this.key.replace("button", "");
		this.sendEventOnClick = parentContract + ".Press" + keyIndex;
	}

	//#endregion

	//#region 5. Events - event binding

	protected _onTapAction() {
		if (null !== this._intervalIdForRepeatDigital) {
			window.clearInterval(this._intervalIdForRepeatDigital);
			this.sendValueForClickValue(false);
			this._intervalIdForRepeatDigital = null;
		} else {
			this._sendOnClickSignal(false, false);
		}
	}

	//#endregion
}

Ch5KeypadButton.registerSignalAttributeTypes();
Ch5KeypadButton.registerCustomElement();