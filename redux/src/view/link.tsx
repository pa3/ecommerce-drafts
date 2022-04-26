import { ReactNode, MouseEvent, useCallback } from "react";
import { useDispatch } from "react-redux";
import { goToUrl } from "@/core/app";

type LinkProps = {
  url: string;
  children: ReactNode;
};

export const Link = (props: LinkProps) => {
  const dispatch = useDispatch();

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      dispatch(goToUrl({ url: props.url }));
    },
    [props.url]
  );

  return (
    <a href={props.url} onClick={onClick}>
      {props.children}
    </a>
  );
};
