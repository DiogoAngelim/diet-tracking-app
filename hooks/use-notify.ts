"use client";
import { useNotifications } from '../components/notifications-context';
import React from 'react';

export default function useNotify() {
  const { addNotification } = useNotifications();
  return addNotification;
}
