import { ReactNode, MouseEvent, useCallback } from "react";
import { useDispatch } from "react-redux";
import { actions, goToUrl } from "@/core/app";

interface LinkProps {
  url: string;
  children: ReactNode;
}

export const Link = (props: LinkProps) => {
  const dispatch = useDispatch();

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      dispatch(actions.goToUrl(props.url));
    },
    [props.url]
  );

  return (
    <a href={props.url} onClick={onClick}>
      {props.children}
    </a>
  );
};
