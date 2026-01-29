import { useEffect, useRef, useState } from "react";
import { RxAvatar, RxExit } from "react-icons/rx";
import { RiFileUserLine } from "react-icons/ri";

type AvatarMenuDropdownProps = {
  displayName?: string;
  avatarUrl?: string | null;
  onEditProfile?: () => void;
  onLogout?: () => void;
};

export function AvatarMenuDropdown({
  displayName = "User",
  avatarUrl = null,
  onEditProfile,
  onLogout,
}: AvatarMenuDropdownProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuItemsRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // When menu opens, focus first menu item
  useEffect(() => {
    if (open) {
      // focus first item if available
      setTimeout(() => {
        menuItemsRefs.current[0]?.focus();
      }, 0);
    }
  }, [open]);

  return (
    <div className="relative rounded-full" ref={menuRef}>
      {/* Avatar */}
      <button
        id="user-menu-button"
        ref={toggleButtonRef}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
            // focus handled in effect
          }
        }}
        className="cursor-pointer flex h-9 w-auto pr-4 items-center rounded-full border border-mint-50 bg-primary text-primary-foreground focus:outline-none"
        aria-label="Open user menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="user-menu"
      >
        {avatarUrl ? (
          <>
            <div className="block border border-mint-50 rounded-full max-w-9 max-h-9">
              <img
              src={avatarUrl}
              alt="User avatar"
              className="h-full w-full rounded-full object-cover"
              />
            </div>
            <span className="ml-2 text-gray-15 font-medium">{displayName}</span>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold">
              <RxAvatar className="w-9 h-9 text-gray-15 border border-mint-50" />
            </span>
            <span className="ml-2 text-gray-15 font-medium">{displayName}</span>
          </>
        )}

        
      </button>

      
      {/* Dropdown */}
      <div
        className={`
          absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-md
          transition-all duration-200 ease-out
          ${open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}
        `}
        id="user-menu"
        role="menu"
        aria-hidden={!open}
        aria-labelledby="user-menu-button"
        onKeyDown={(e) => {
          const items = menuItemsRefs.current;
          const idx = items.findIndex((el) => document.activeElement === el);

          if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = items[(idx + 1) % items.length];
            next?.focus();
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = items[(idx - 1 + items.length) % items.length];
            prev?.focus();
          }

          if (e.key === "Escape") {
            setOpen(false);
            toggleButtonRef.current?.focus();
          }
        }}
      >
        <button
          onClick={() => {
            setOpen(false);
            onEditProfile?.();
          }}
          className="block w-full align-middle px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          tabIndex={open ? 0 : -1}
          ref={(el) => { menuItemsRefs.current[0] = el; }}
        >
          <RiFileUserLine className="inline w-5 h-5 mr-2 align-sub" /> Edit Profile
        </button>

        <button
          onClick={() => {
            setOpen(false);
            onLogout?.();
          }}
          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          role="menuitem"
          tabIndex={open ? 0 : -1}
          ref={(el) => { menuItemsRefs.current[1] = el; }}
        >
          <RxExit className="inline w-5 h-5 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}
