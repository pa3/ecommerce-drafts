import { times } from "@/core/utils";

type PaginatorProps = {
  page: number;
  perPage: number;
  totalPages: number;
  onGoToPage: (page: number) => void;
  onPageSizeChange: (perPage: number) => void;
};

export const Paginator = (props: PaginatorProps) => {
  return (
    <div>
      {times(props.totalPages, (i: number) => {
        const page = i + 1;
        return (
          <button key={page} disabled={page === props.page} onClick={() => props.onGoToPage(page)}>
            {page}
          </button>
        );
      })}

      <label htmlFor="per-page">Per page</label>
      <select id="per-page" value={props.perPage} onChange={(event) => props.onPageSizeChange(parseInt(event.target.value, 10))}>
        {[10, 20, 50].map((perPage) => (
          <option key={perPage} value={perPage}>
            {perPage}
          </option>
        ))}
      </select>
    </div>
  );
};
