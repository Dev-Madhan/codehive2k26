"use client";

import * as React from "react";
import Link from "next/link";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  GripVerticalIcon,
  CircleCheckIcon,
  EllipsisVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  PlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  SparklesIcon,
} from "lucide-react";
import type { DashboardEventItem } from "@/types/dashboard";

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

export const schema = z.object({
  id: z.number(),
  dbId: z.string(),
  header: z.string(),
  slug: z.string(),
  type: z.string(),
  categorySlug: z.string(),
  status: z.string(),
  venue: z.string(),
  isTeamEvent: z.boolean(),
  minTeamSize: z.number(),
  maxTeamSize: z.number(),
  teamFormat: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  registrationsCount: z.number(),
  teamsCount: z.number(),
  description: z.string(),
});

const columnHelper = createColumnHelper<
  typeof features,
  z.infer<typeof schema>
>();

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVerticalIcon className="size-3 text-slate-500" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();
  return (
    <Drawer swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger
        render={
          <Button
            variant="link"
            className="w-fit px-0 text-left font-mono font-bold text-xs text-white hover:text-blue-400 transition-colors cursor-pointer"
          />
        }
      >
        {item.header}
      </DrawerTrigger>
      <DrawerContent className="bg-[#060D1A] border-[#152A54] text-white font-mono rounded-none max-w-2xl mx-auto">
        <DrawerHeader className="gap-1 border-b border-[#152A54] p-4 sm:p-5">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 border border-blue-500/40 px-2 py-0.5 uppercase tracking-wider">
              {item.type}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 uppercase tracking-wider">
              {item.status}
            </span>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 uppercase tracking-wider">
              {item.teamFormat}
            </span>
          </div>
          <DrawerTitle className="text-base sm:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <SparklesIcon className="size-4 text-blue-400 shrink-0" />
            <span>{item.header}</span>
          </DrawerTitle>
          <DrawerDescription className="text-xs text-slate-400 leading-relaxed">
            {item.venue}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-3.5 overflow-y-auto p-4 sm:p-5 text-xs max-h-[65vh]">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="border border-[#152A54] bg-[#03060E] p-3 space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider block">
                Total Registrations
              </span>
              <p className="text-2xl font-bold text-blue-400 tabular-nums">
                {item.registrationsCount}
              </p>
            </div>
            <div className="border border-[#152A54] bg-[#03060E] p-3 space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider block">
                Teams Formed
              </span>
              <p className="text-2xl font-bold text-purple-400 tabular-nums">
                {item.teamsCount}
              </p>
            </div>
            <div className="border border-[#152A54] bg-[#03060E] p-3 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider block">
                Participation Mode
              </span>
              <p className="text-xs font-bold text-white uppercase mt-1">
                {item.teamFormat}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="border border-[#152A54] bg-[#03060E] p-3.5 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block flex items-center gap-1.5">
              <span>Track Challenge Overview</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {item.description || "Official symposium challenge details and guidelines."}
            </p>
          </div>

          {/* Logistics & Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="border border-[#152A54] bg-[#03060E] p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPinIcon className="size-3 text-slate-500" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Venue</span>
              </div>
              <p className="text-xs text-white font-semibold">{item.venue}</p>
            </div>
            <div className="border border-[#152A54] bg-[#03060E] p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <CalendarDaysIcon className="size-3 text-slate-500" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Dates</span>
              </div>
              <p className="text-xs text-white font-semibold">
                {item.startAt
                  ? new Date(item.startAt).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "October 2026"}
              </p>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-[#152A54] bg-[#03060E] flex flex-row items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/registrations"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 transition-colors uppercase"
            >
              <UsersIcon className="size-3.5" />
              <span>View Attendees</span>
            </Link>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-[#060D1A] hover:bg-[#0B162C] border border-[#152A54] transition-colors uppercase"
            >
              <span>Manage Track</span>
            </Link>
          </div>
          <DrawerClose render={<Button variant="outline" className="rounded-none border-[#152A54] bg-[#060D1A] text-slate-300 font-mono text-xs uppercase" />}>
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const columns = columnHelper.columns([
  columnHelper.display({
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  }),
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("header", {
    header: "Event / Track",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  }),
  columnHelper.accessor("type", {
    header: "Category",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="px-1.5 font-mono text-[10px] text-blue-400 border-blue-500/30 bg-blue-600/10 rounded-none uppercase"
      >
        {row.original.type}
      </Badge>
    ),
  }),
  columnHelper.accessor("teamFormat", {
    header: "Format",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="px-1.5 font-mono text-[10px] text-purple-400 border-purple-500/30 bg-purple-600/10 rounded-none uppercase"
      >
        {row.original.teamFormat}
      </Badge>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="px-1.5 font-mono text-[10px] rounded-none border-[#152A54] text-emerald-400 bg-emerald-950/20"
      >
        <CircleCheckIcon className="size-3 mr-1 text-emerald-400" />
        {row.original.status}
      </Badge>
    ),
  }),
  columnHelper.accessor("registrationsCount", {
    header: () => <div className="w-full text-right font-mono">Registrations</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs font-bold text-white tabular-nums pr-2">
        {row.original.registrationsCount}
      </div>
    ),
  }),
  columnHelper.accessor("teamsCount", {
    header: () => <div className="w-full text-right font-mono">Teams</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs font-semibold text-slate-300 tabular-nums pr-2">
        {row.original.teamsCount}
      </div>
    ),
  }),
  columnHelper.accessor("venue", {
    header: "Venue",
    cell: ({ row }) => (
      <span
        className="font-mono text-xs text-slate-400 truncate max-w-[160px] block"
        title={row.original.venue}
      >
        {row.original.venue}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-open:bg-muted"
              size="icon"
            />
          }
        >
          <EllipsisVerticalIcon className="size-4 text-slate-400" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 font-mono text-xs bg-[#060D1A] border-[#152A54] text-slate-200 rounded-none"
        >
          <DropdownMenuItem
            render={<Link href="/admin/registrations" />}
            className="cursor-pointer hover:bg-[#0B162C]"
          >
            View Registrations
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href="/admin/events" />}
            className="cursor-pointer hover:bg-[#0B162C]"
          >
            Event Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
]);

function DraggableRow({
  row,
}: {
  row: Row<typeof features, z.infer<typeof schema>>;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          <FlexRender cell={cell} />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: DashboardEventItem[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Compute category statistics for tabs
  const categoryStats = React.useMemo(() => {
    const technicalCount = data.filter(
      (d) =>
        d.categorySlug === "technical" ||
        d.type.toLowerCase().includes("technical")
    ).length;
    const nonTechnicalCount = data.filter(
      (d) =>
        d.categorySlug === "non-technical" ||
        d.type.toLowerCase().includes("non-technical")
    ).length;
    return {
      all: data.length,
      technical: technicalCount,
      nonTechnical: nonTechnicalCount,
    };
  }, [data]);

  // Filter items based on activeCategory
  const filteredData = React.useMemo(() => {
    if (activeCategory === "all") return data;
    if (activeCategory === "technical") {
      return data.filter(
        (d) =>
          d.categorySlug === "technical" ||
          d.type.toLowerCase().includes("technical")
      );
    }
    if (activeCategory === "non-technical") {
      return data.filter(
        (d) =>
          d.categorySlug === "non-technical" ||
          d.type.toLowerCase().includes("non-technical")
      );
    }
    return data;
  }, [data, activeCategory]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData?.map(({ id }) => id) || [],
    [filteredData]
  );

  const table = useTable({
    features,
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(prev, oldIndex, newIndex);
        }
        return prev;
      });
    }
  }

  return (
    <Tabs
      value={activeCategory}
      onValueChange={setActiveCategory}
      className="w-full flex-col justify-start gap-4 sm:gap-6 font-mono"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View Category
        </Label>
        <Select
          value={activeCategory}
          onValueChange={(val) => {
            if (val) setActiveCategory(val);
          }}
        >
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden font-mono text-xs rounded-none border-[#152A54] bg-[#060D1A]"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Filter Track" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#152A54]/60 mb-1 flex items-center justify-between">
              <span>// SYMPOSIUM TRACKS</span>
              <span className="text-blue-400 font-bold">{categoryStats.all} TOTAL</span>
            </div>
            <SelectGroup>
              <SelectItem value="all">All Tracks ({categoryStats.all})</SelectItem>
              <SelectItem value="technical">
                Technical ({categoryStats.technical})
              </SelectItem>
              <SelectItem value="non-technical">
                Non-Technical ({categoryStats.nonTechnical})
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <TabsList className="hidden font-mono text-xs rounded-none border border-[#152A54] bg-[#060D1A] **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-none **:data-[slot=badge]:bg-blue-600/20 **:data-[slot=badge]:text-blue-400 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger
            value="all"
            className="rounded-none data-[state=active]:bg-[#0B162C] data-[state=active]:text-white flex items-center gap-1.5"
          >
            All Tracks <Badge variant="secondary">{categoryStats.all}</Badge>
          </TabsTrigger>
          <TabsTrigger
            value="technical"
            className="rounded-none data-[state=active]:bg-[#0B162C] data-[state=active]:text-white flex items-center gap-1.5"
          >
            Technical <Badge variant="secondary">{categoryStats.technical}</Badge>
          </TabsTrigger>
          <TabsTrigger
            value="non-technical"
            className="rounded-none data-[state=active]:bg-[#0B162C] data-[state=active]:text-white flex items-center gap-1.5"
          >
            Non-Technical <Badge variant="secondary">{categoryStats.nonTechnical}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none border-[#152A54] bg-[#060D1A] hover:bg-[#0B162C] text-slate-300 font-mono text-xs"
                />
              }
            >
              <Columns3Icon className="size-3.5 mr-1 text-slate-400" />
              Columns
              <ChevronDownIcon className="size-3.5 ml-1 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44"
            >
              <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#152A54]/60 mb-1 flex items-center justify-between">
                <span>// TOGGLE COLUMNS</span>
              </div>
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize rounded-none hover:bg-[#0B162C]"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            render={<Link href="/admin/events" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="rounded-none border-[#152A54] bg-[#060D1A] hover:bg-[#0B162C] text-slate-300 font-mono text-xs cursor-pointer"
          >
            <PlusIcon className="size-3.5 mr-1 text-blue-400" />
            <span className="hidden sm:inline">Add Track</span>
          </Button>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-3 sm:px-4 lg:px-6 max-w-full">
        <div className="overflow-x-auto rounded-none border border-[#152A54] bg-[#060D1A] max-w-full">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-[#03060E] border-b border-[#152A54]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <FlexRender header={header} />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-slate-500 font-mono text-xs"
                    >
                      No events registered in this track category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 font-mono text-xs">
          <div className="text-slate-500 text-center sm:text-left text-[11px] sm:text-xs">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} track(s) selected.
          </div>
          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 sm:gap-6">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-xs text-slate-400">
                Rows per page
              </Label>
              <Select
                value={`${table.state.pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="w-20 rounded-none border-[#152A54] bg-[#060D1A] font-mono text-xs text-slate-300"
                  id="rows-per-page"
                >
                  <SelectValue placeholder={table.state.pagination.pageSize} />
                </SelectTrigger>
                <SelectContent
                  side="top"
                  className="rounded-none border-[#152A54] bg-[#030712] font-mono text-xs text-slate-300"
                >
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem
                        key={pageSize}
                        value={`${pageSize}`}
                        className="rounded-none hover:bg-[#0B162C]"
                      >
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-xs text-slate-400">
              Page {table.state.pagination.pageIndex + 1} of{" "}
              {Math.max(table.getPageCount(), 1)}
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                className="hidden size-8 rounded-none border-[#152A54] bg-[#060D1A] hover:bg-[#0B162C] text-slate-300 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 rounded-none border-[#152A54] bg-[#060D1A] hover:bg-[#0B162C] text-slate-300"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 rounded-none border-[#152A54] bg-[#060D1A] hover:bg-[#0B162C] text-slate-300"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 rounded-none border-[#152A54] bg-[#060D1A] hover:bg-[#0B162C] text-slate-300 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
