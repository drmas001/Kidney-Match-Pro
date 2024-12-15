import { type LinkProps, NavLink as RouterNavLink } from 'react-router-dom';

export interface NavLinkProps extends Omit<LinkProps, 'className'> {
  className?: string | ((props: { isActive: boolean }) => string);
}

export const NavLink = RouterNavLink;