import { ReactNode, MouseEvent, useCallback } from "react";
import { useDispatch } from "react-redux";
import { actions } from "@/core/app";
import { createView } from "@/core/routes";

interface LinkProps {
  url: string;
  children: ReactNode;
}

export const Link = (props: LinkProps) => {
  const dispatch = useDispatch();

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const view = createView(props.url);
      dispatch(actions.goTo({ view }));
    },
    [props.url]
  );

  return (
    <a href={props.url} onClick={onClick}>
      {props.children}
    </a>
  );
};
