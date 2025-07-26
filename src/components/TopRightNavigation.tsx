import {
  Bell,
  Search,
  Check,
  Trophy,
  CalendarClock,
  Target,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTheme } from "@/components/theme-provider";

dayjs.extend(relativeTime);

interface Notification {
  id: string;
  title: string;
  category: "quest" | "deadline" | "achievement";
  created_at: string;
  read: boolean;
}

const CATEGORY_ICONS = {
  quest: <Target className="w-4 h-4 text-purple-500" />,
  deadline: <CalendarClock className="w-4 h-4 text-red-500" />,
  achievement: <Trophy className="w-4 h-4 text-yellow-500" />,
};

const mockData: Notification[] = [
  {
    id: "1",
    title: "🎯 New quest: Complete lab 4",
    category: "quest",
    created_at: dayjs().subtract(3, "minute").toISOString(),
    read: false,
  },
  {
    id: "2",
    title: "📚 Assignment 5 due today",
    category: "deadline",
    created_at: dayjs().subtract(2, "hour").toISOString(),
    read: false,
  },
  {
    id: "3",
    title: "🎉 Achievement unlocked: Top 10!",
    category: "achievement",
    created_at: dayjs().subtract(1, "day").toISOString(),
    read: true,
  },
];

const TopRightNavigation = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(320); // из 500 например

  useEffect(() => {
    setNotifications(mockData);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const xpPercentage = Math.min((xp / 500) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      {/* Search */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <Search className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <h2 className="text-lg font-semibold mb-2">Search</h2>
          <Input
            placeholder="Search anything..."
            className="dark:bg-neutral-900"
          />
        </DialogContent>
      </Dialog>

      {/* Dark Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-muted-foreground"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((n) => !n.read) && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
              >
                {
                  notifications.filter((n) => !n.read).length > 9
                    ? "9+"
                    : notifications.filter((n) => !n.read).length
                }
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 dark:bg-neutral-900">
          <div className="flex justify-between items-center p-2 border-b dark:border-neutral-700">
            <p className="text-sm font-semibold">Notifications</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, read: true }))
                )
              }
            >
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-64 p-2">
            {notifications.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2 p-2 rounded-md hover:bg-muted transition ${
                    n.read ? "opacity-60" : ""
                  }`}
                >
                  <div className="pt-1">{CATEGORY_ICONS[n.category]}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(n.created_at).fromNow()}
                    </p>
                  </div>
                  {!n.read && (
                    <Button
                      onClick={() => markAsRead(n.id)}
                      variant="ghost"
                      size="sm"
                      className="text-xs px-2"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TopRightNavigation;
