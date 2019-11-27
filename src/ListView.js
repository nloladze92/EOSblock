import React, { Component, Suspense, Fragment } from 'react';
import nl2br from 'react-newline-to-break';
import _ from 'lodash';
import Mustache from 'mustache';
import { Accordion, List, Segment, Header, Image, Button, Divider, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import eos from './Images/eoslogo.png';
import './CSS/viewDefinitions.css';
import { getHeadBlock, getBlocks } from './Requests/getChainData';
import Loader from 'react-loader';

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.executeSearch = this.executeSearch.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      headBlock: null,
      blockValue: null,
      arrayToPass: [],
      numberofBlocks: 10,
      activeIndex: null,
      loaded: false,
    };
  }
  
  componentDidMount = async () => {
    this.executeSearch();
  }

  executeSearch = async () => {
    var that = this;
    this.setState({loaded: false})
    await getHeadBlock().then(function(getHeadBlock) {
      that.setState({headBlock: getHeadBlock.head_block_num});
   });
   await getBlocks(this.state.headBlock, this.state.numberofBlocks).then(function(getBlocks) {
    that.setState({arrayToPass: getBlocks});
   })
   this.setState({loaded: true})
  }

  handleClick = async (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }
  
  render() {
    const { activeIndex } = this.state;

    const Child = ({data}) => (
      <Loader className="adjustLoader" loaded={this.state.loaded}>
      <List divided inverted relaxed>
        {data.map((x, i) => (
          <Accordion inverted>
          <List.Header className="fulldisplay" as='h4'>Hash Block: {x.id} <br />
          Dated: {x.timestamp}</List.Header>
          <Accordion.Title
          active={activeIndex === i}
          index={i}
          onClick={this.handleClick}
        >
          <Button className="buttonMargin" color="yellow" basic floated="right" size="small">
          <Icon name='dropdown' />
          Display Block
          </Button>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === i}>
        <List.Item key={i}>
        <List.Content className="fulldisplay">

            
            {nl2br(Mustache.render("The Producer: {{producer}}\n" +
            "Confirmed Transactions: {{confirmed}}\n" +
            "Previous Block ID: {{previous}}\n" +
            "Transaction Merkle Root: {{transaction_mroot}}\n" +
            "Action Merkle Root: {{action_mroot}}\n" +
            "Schedule Version {{schedule_version}}\n" +
            "New Producers: {{new_producers}}\n" +
            "Producer Signature: {{producer_signature}}\n" +
            "Block Extensions: {{block_extensions}}\n" +
            "Block ID: {{id}}\n" +
            "Ref Block Prefix: {{ref_block_prefix}}\n\n" +
            "Transactions in Block: \n" + 
            "{{#transactions}}\{\nStatus: {{status}}\nCPU Usage: {{cpu_usage_us}}\nNet Usage Words:{{net_usage_words}}\nTrx: {{trx}}\n\}\n{{/transactions}}\n"
            , x))}
          
        </List.Content>
        </List.Item>
        </Accordion.Content>
        <Divider />
      </Accordion>
        ))}
        </List>
        </Loader>
    );

    return(
  <Segment inverted style={{height: "100%"}}>
    <Image src={eos} size='tiny' floated="left" style={{marginTop: "1vh"}}/>
    <Header as='h1' color="yellow">EOS Blocks</Header>
    <Header.Subheader>
    <Button color="yellow" className="adjustDisplayBlock" size="medium" basic>Current Head Block Displayed: {this.state.headBlock} </Button>
      <Button onClick={() => this.executeSearch()} className="buttonMargin" color="yellow" basic floated="right" size="medium">
        Load
      </Button>
    </Header.Subheader>
    <Divider />
      <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
      {this.state.arrayToPass && (
      <Child data={this.state.arrayToPass} />
    )}
  </Suspense>
  </Fragment>
  </Segment>
);
  }
}
