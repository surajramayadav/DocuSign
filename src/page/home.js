import React, { useEffect, useState } from 'react'
import styles from '../assets/css/global.module.css'
import COLORS from '../constant/color'
import axios from 'axios'
import ReactLoading from 'react-loading';
import Loading from 'react-loading';
export default function Home() {
    let initialState = {
        name: "",
        category: '',
        group: "",
        htmlCode: "",
    }

    const [allFetchedProduct, setAllFetchedProduct] = useState([])
    const [emoji, setemoji] = useState([])
    const [paginatedProduct, setPaginatedProduct] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [showTable, setShowTable] = useState(true)
    const [chooseNoOfDataToShow, setChooseNoOfDataToShow] = useState(10)
    const [paginationSize, setPaginationSize] = useState(1)
    const [category, setcategory] = useState([])

    const [loading, setloading] = useState(false)
    console.log('paginationSize', paginationSize)


    const getEmojiData = async () => {
        const { data } = await axios.get('https://emojihub.yurace.pro/api/all')
        console.log(data)
        setAllFetchedProduct(data)
        setemoji(data)
        getcategories(data)
        fn_getProductFromPagination(data)
        setloading(false)

    }


    const getcategories = (data) => {
        let category = []
        let uniqueElements = []
        if (data.length != 0) {
            data.map((d, i) => {
                category.push(d.category)
            })
            uniqueElements = [...new Set(category)];
        }
        console.log("uniqueElements", uniqueElements);
        setcategory(uniqueElements)
    }

    React.useEffect(() => {
        setloading(true)
        getEmojiData()
    }, [])

    React.useEffect(() => {
        console.log("================================================")
        if (allFetchedProduct.length != 0) {
            console.log(" setChooseNoOfDataToShow(e.target.value)", allFetchedProduct)
            fn_getProductFromPagination(allFetchedProduct)
        }

    }, [showTable, chooseNoOfDataToShow, currentPage])

    const fn_getProductFromPagination = async (data) => {
        setPaginationSize(Math.ceil(allFetchedProduct.length / chooseNoOfDataToShow))
        const chunkOfData = await fn_sliceIntoChunks(data, chooseNoOfDataToShow)
        setPaginatedProduct(chunkOfData)
    }

    const fn_sliceIntoChunks = (arr, chunkSize) => {

        const res = [];

        let nxtpgeStart = currentPage * chunkSize - chunkSize
        let nxtpgeEnd = parseInt(nxtpgeStart) + parseInt(chunkSize)
        for (let i = nxtpgeStart; i < nxtpgeEnd; i++) {
            res.push(arr[i]);
        }
        console.log('res', res)
        const data = res.filter(Boolean);
        console.log('data', data)
        return data;
    }

    const filterCaterories = (cat) => {
        console.log("cat", cat)
        if (cat == 0) {
            setAllFetchedProduct(emoji)
            fn_getProductFromPagination(emoji)
        } else {
            const data = emoji.filter((e) => e.category == cat)
            console.log("data", data)
            setAllFetchedProduct(data)
            fn_getProductFromPagination(data)
        }
    }


    console.log("allFetchedProduct", allFetchedProduct)
    return (
        <>
            {loading ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "90vh" }}>
                    <ReactLoading type="bubbles" color={COLORS.PRIMARY} />
                </div>
                :
                <div className='container' style={{ marginBottom: "10%" }}>
                    <div className='row mt-2'>

                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='row  mt-5'>
                                <div className={styles.fec}>
                                    {/* <button type="button" className="btn btn-warning header-kotak">Category Filter</button> */}
                                    <label style={{ marginRight: 10 }}>Filter by category</label>
                                    {<select className='form-control-sm' onChange={(e) => filterCaterories(e.target.value)}>
                                        <option value="0">All</option>
                                        {category.length != 0 && category.map((d) => {
                                            return (
                                                <option value={d}>{d}</option>
                                            )
                                        })}
                                    </select>}
                                </div>
                            </div>
                            <table className="table table-bordered mt-1">
                                <thead className='header-kotak'>
                                    <tr >
                                        <th onClick={() => {
                                            // const sortedData = allFetchedProduct.sort((a, b) => a.productName.localeCompare(b.productName))
                                            // fn_getProductFromPagination(sortedData)
                                        }
                                        }>Name</th>
                                        <th>Category</th>
                                        <th>group</th>
                                        <th>htmlCode</th>

                                    </tr>
                                </thead>


                                <tbody>
                                    {paginatedProduct?.map((d, i) => {
                                        return (
                                            <tr key={i + 1}>
                                                {/* <th scope="row">{i + 1}</th> */}

                                                <td>{d.name}</td>
                                                <td>{d.category}</td>
                                                <td>{d.group}</td>
                                                <td>
                                                    <span role="img" aria-label="sheep">{d.htmlCode[0]}</span>

                                                </td>


                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className={styles.fbc}>
                                <select className='form-control-sm' onChange={(e) => setChooseNoOfDataToShow(e.target.value)}>
                                    <option value="10">10</option>
                                    {/* <option value="15">15</option> */}
                                </select>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn btn-danger" disabled={currentPage <= 1} onClick={() => currentPage != 1 && setCurrentPage(currentPage - 1)}>Previous</button>
                                    <button type="button" className="btn btn-primary">{currentPage} of  {Math.round(allFetchedProduct.length + 1 / 10)}</button>
                                    <button type="button" className="btn" style={{ backgroundColor: COLORS.SECONDARY, color: 'white' }} disabled={currentPage >= paginationSize} onClick={() => paginationSize > currentPage && setCurrentPage(currentPage + 1)}>Next</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}