import React, { useMemo, useEffect, useState } from 'react'
import { useTable } from 'react-table'
import { useRowSelectHooks } from 'react-table'
import { useRowSelect } from 'react-table'
import { useRowSelectRowProps } from 'react-table'
import { COLUMNS} from './columns'
import './table_style.css'

const Button1 = () => {
    <button>
        test
    </button>
}
const Checkbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  ) // there is a Checkbox.js file, but for some reason I cannot import it.

function Table(props){
    // data will not be recreated at every render
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => props.products, [props.products])    //https://stackoverflow.com/questions/71889235/react-table-not-showing-newly-fetched-data-when-rendering

    // used alongside useTable (react table)
    const tableInstance = useTable({
        columns,
        data
    },
    useRowSelect,
    (hooks) => {
        hooks.visibleColumns.push((columns) => {
            return [
                {
                    id:'selection',
                    Header: ({getToggleAllRowsSelectedProps}) => (
                        <Checkbox {...getToggleAllRowsSelectedProps()} />
                    ),
                    Cell: ({row}) => (
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    )
                }, 
                ...columns
            ]
        })
    })

    const {
        getTableProps, // destructured in <table> tag
        getTableBodyProps, // <tbody>
        headerGroups, 
        rows, 
        prepareRow,
        selectedFlatRows
    } = tableInstance

    
    //get product_IDs of selected rows and pass to parent state (Delete.js)
    useEffect(() => {
        const productIDs = selectedFlatRows.map((row) => row.original.product_ID)
        props.setProductIDsToDrop(productIDs);
    }, [selectedFlatRows])

    return (
    <>
        {/*table header data */}
        <table {...getTableProps()}>
            <thead>
                {
                    headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps}>
                            {
                                headerGroup.headers.map( column =>(
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))
                            }
                        </tr>
                    ))
                }
            </thead>

            {/* table body data */} 
            <tbody {...getTableBodyProps()}>
                {
                    rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map( cell =>{
                                        return <td {...cell.getCellProps()}>
                                            
                                            {/* <button> */}
                                            {
                                            cell.render('Cell')
                                            }
                                            {/* </button> */}
                                            </td>
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </>
    )
}

export default Table;
