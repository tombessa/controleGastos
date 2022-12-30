import MaterialTable from 'material-table';
import MaterialTableProps from 'material-table';
import { AddBox, ArrowDownward } from "@material-ui/icons";
import { ThemeProvider, createTheme } from '@mui/material';

export type GenericTableProps = {
    rest: MaterialTableProps
    selectedRow: any
    setSelectedRow: ChangeEventHandler<any>
    corSelecionada: string
    corNaoSelecionada: string
}

export function GenericTable({rest, selectedRow, setSelectedRow, corSelecionada, corNaoSelecionada}: GenericTableProps){
    if(!rest) return "";
    if(!corSelecionada){corSelecionada='#67aeae'}
    if(!corNaoSelecionada){corNaoSelecionada='#FFF'}
    if(!rest.title) rest.title=""
    const defaultMaterialTheme = createTheme();
    return (<ThemeProvider theme={defaultMaterialTheme}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <MaterialTable          
          data={rest.data}
          setData={rest.setData}
          columns={rest.columns}
          title={rest.title}
            onRowClick={(evt, item) =>{
              setSelectedRow(item);
            }
          }
          options={{...rest.options,
            search: true,            
            rowStyle: rowData => {
              return ({
                backgroundColor:
                (selectedRow ? (selectedRow.id === rowData.id ? corSelecionada : corNaoSelecionada) : corNaoSelecionada)
              });
            }
          }}
          
        />
        
      </ThemeProvider>);
}