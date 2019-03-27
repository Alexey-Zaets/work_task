import React, {Component} from 'react'
import {Link} from 'react-router-dom'


class Pagination extends Component {

    render() {
        return (
            <div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        
                        <li className="page-item"><Link to='' className="page-link" ><span aria-hidden="true">&laquo;</span></Link></li>
                        <li className="page-item">
                            <Link to='' className="page-link" ></Link>
                        </li>
                        
                        <li className="page-item disabled"><Link to='' className="page-link" ><span aria-hidden="true">&laquo;</span></Link></li>
                        

                        <li className="page-item active"><Link to='' className="page-link" ></Link></li>
                          
                        
                        <li className="page-item">
                            <Link to='' className="page-link" ></Link>
                        </li>
                        <li className="page-item"><Link to='' className="page-link" ><span aria-hidden="true">&raquo;</span></Link></li>
                        
                        <li className="page-item disabled"><Link to='' className="page-link" ><span aria-hidden="true">&raquo;</span></Link></li>
                        
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Pagination