import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Separator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  separator?: Separator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: '',
    name: 'Personal',
    type: 'separator',
    icon: 'av_timer',
  },
  {
    state: 'dashboard/profile',
    name: 'Profile',
    type: 'link',
    icon: 'account_box',
  },
  {
    state: 'dashboard/emergency-contact',
    name: 'Emergency Contact',
    type: 'link',
    icon: 'contact_emergency',
  },
  {
    state: 'dashboard/health-card',
    name: 'Health Card',
    type: 'link',
    icon: 'credit_card',
  },
  {
    state: 'dashboard/clinician',
    name: 'Clinician',
    type: 'link',
    icon: 'medical_services',
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
