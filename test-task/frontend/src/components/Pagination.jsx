import React, {Component} from 'react'


class Pagination extends Component {

    render() {
        return (
            <div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        
                        <li className="page-item"><a className="page-link" ><span aria-hidden="true">&laquo;</span></a></li>
                        <li className="page-item">
                            <a className="page-link" ></a>
                        </li>
                        
                        <li className="page-item disabled"><a className="page-link" ><span aria-hidden="true">&laquo;</span></a></li>
                        

                        <li className="page-item active"><a className="page-link" ></a></li>
                          
                        
                        <li className="page-item">
                            <a className="page-link" ></a>
                        </li>
                        <li className="page-item"><a className="page-link" ><span aria-hidden="true">&raquo;</span></a></li>
                        
                        <li className="page-item disabled"><a className="page-link" ><span aria-hidden="true">&raquo;</span></a></li>
                        
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Pagination