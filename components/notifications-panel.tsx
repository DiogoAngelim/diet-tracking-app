"use client";

import { Bell, AlertCircle, Wallet, Clock, BarChart3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNotifications, Notification } from "./notifications-context";

function getNotificationIcon(type: Notification["type"] | undefined) {
  switch (type) {
    case "nutrient":
      return <AlertCircle className="h-5 w-5 text-primary" />;
    case "budget":
      return <Wallet className="h-5 w-5 text-amber-500" />;
    case "reminder":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "summary":
      return <BarChart3 className="h-5 w-5 text-emerald-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
}

function formatTimeAgo(date: Date | string | undefined | null): string {
  if (!date) return "";
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else {
    d = new Date(date);
    if (isNaN(d.getTime())) return "";
  }
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function NotificationsPanel() {
  const { notifications, markAsRead } = useNotifications();
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Observations</h1>
        <p className="text-sm text-muted-foreground">
          Stay on track with gentle reminders
        </p>
      </div>

      {unreadNotifications.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">New</CardTitle>
                <CardDescription>{unreadNotifications.length} unread observations</CardDescription>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {unreadNotifications.length}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3"
              >
                <div className="mt-0.5 shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-card-foreground">{notification.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatTimeAgo(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-7 px-2 text-xs"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Mark as read
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {unreadNotifications.length === 0 && readNotifications.length === 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Observations</CardTitle>
            <CardDescription>You&apos;re all caught up! New observations will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Older notifications</CardTitle>
          <CardDescription>
            {readNotifications.length === 0
              ? "No older notifications"
              : `${readNotifications.length} notifications`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {readNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">All caught up!</p>
            </div>
          ) : (
            readNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex gap-3 rounded-lg border bg-card p-3 opacity-75"
              >
                <div className="mt-0.5 shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-card-foreground">{notification.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatTimeAgo(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Weekly Summary Preview */}
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Be ready. Your weekly summary is coming soon...
          </CardTitle>
          <CardDescription>
            Every Sunday, you&apos;ll receive a comprehensive summary of your week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">Nutrient trends & highlights</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">Budget spending analysis</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">Personalized recommendations</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">Risk alerts for deficiencies</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
