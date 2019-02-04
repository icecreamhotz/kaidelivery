import React from 'react'
import ContentLoader from 'react-content-loader'
import Grid from '@material-ui/core/Grid';

export class LoaderInfo extends React.Component {
    render() {
        return(
            <div className="content-start">
				<Grid container spacing={0} justify="center">
                    <Grid item xs={9}>
						<Grid container>
                            <Grid item xs={12} lg={3} style={{padding: 10}}>
								<ContentLoader 
									rtl
									height={800}
									width={320}
									speed={2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
								>
									<circle cx="176.22" cy="155" r="100" /> 
									<rect x="33.69" y="310" rx="0" ry="0" width="281.81" height="15.59" />
								</ContentLoader>
							</Grid>
							<Grid item xs style={{padding: 10}}>
								<ContentLoader 
									rtl
									height={800}
									width={360}
									speed={2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
								>

									<circle cx="37.08" cy="40" r="20.85" /> 
									<rect x="64.14" y="52" rx="4" ry="4" width="109.98" height="6.02" /> 
									<circle cx="37.08" cy="100" r="20.85" /> 
									<rect x="64.14" y="112" rx="4" ry="4" width="109.98" height="6.02" /> 

									<circle cx="215.08" cy="40" r="20.85" /> 
									<rect x="246.14" y="52" rx="4" ry="4" width="109.98" height="6.02" />
									<circle cx="215.08" cy="100" r="20.85" /> 
									<rect x="246.14" y="112" rx="4" ry="4" width="109.98" height="6.02" />

									<circle cx="37.08" cy="160" r="20.85" /> 
									<rect x="64.14" y="172" rx="4" ry="4" width="292" height="6.02" /> 
								</ContentLoader>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
        )
    }
}

